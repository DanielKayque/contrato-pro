import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { gerarPDF } from '../services/pdfService.js';

const criarContratoSchema = z.object({
  nicho: z.string().min(1),
  titulo: z.string().min(1),
  nomeCliente: z.string().min(1),
  servico: z.string().min(1),
  valor: z.string().min(1),
  dataInicio: z.string().min(1),
  dataFim: z.string().min(1),
  nomeFreelancer: z.string().min(1),
});

export class ContratoController {
  async gerar(req: Request, res: Response) {
    const result = criarContratoSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: 'Dados inválidos.',
        erros: z.treeifyError(result.error),
      });
    }

    const { nicho, titulo, ...dadosContrato } = result.data;
    const usuarioId = req.userId; // vem do middleware autenticar

    if (!usuarioId) {
      return res.status(401).json({ message: 'Faça login para continuar' });
    }

    try {
      // Checa limite do plano free (máx 3 por mês)
      const usuario = await prisma.usuario.findUnique({
        where: { id: usuarioId },
      });

      if (usuario?.plano === 'FREE') {
        const inicioDoMes = new Date();
        inicioDoMes.setDate(1);
        inicioDoMes.setHours(0, 0, 0, 0);

        const totalNoMes = await prisma.contrato.count({
          where: {
            usuarioId,
            criadoEm: { gte: inicioDoMes },
          },
        });

        if (totalNoMes >= 3) {
          return res.status(403).json({
            message:
              'Limite de 3 contratos/mês atingido. Faça upgrade para continuar.',
            upgrade: true,
          });
        }
      }

      // Gera o PDF em memória
      const pdfBuffer = await gerarPDF(nicho, dadosContrato);

      // Salva o contrato no banco (sem URL de PDF por enquanto)
      const contrato = await prisma.contrato.create({
        data: {
          titulo,
          nicho,
          dadosJson: dadosContrato,
          usuarioId,
        },
      });

      // Retorna o PDF direto como download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="contrato-${contrato.id}.pdf"`,
      );
      return res.send(pdfBuffer);
    } catch (err) {
      if (err instanceof Error) {
        console.error('Erro ao gerar contrato: ' + err.message);
        return res
          .status(500)
          .json({ message: 'Erro ao gerar o contrato.', error: err.message });
      }
      return res.status(500).json({ message: 'Erro desconhecido.' });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ message: 'Faça login para continuar.' });
      }

      const contratos = await prisma.contrato.findMany({
        where: { usuarioId: req.userId },
        orderBy: { criadoEm: 'desc' },
        select: {
          id: true,
          titulo: true,
          nicho: true,
          criadoEm: true,
          pdfUrl: true,
        },
      });

      return res.status(200).json({ contratos });
    } catch {
      return res.status(500).json({ message: 'Erro ao listar contratos.' });
    }
  }
}
