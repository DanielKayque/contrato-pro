import type { Request, Response } from 'express';
import { stripe } from '../lib/stripe.js';
import { prisma } from '../lib/prisma.js';

export default class paymentControl {
  async createClient(req: Request, res: Response) {
    const { email, name } = req.body();

    try {
      const customer = await stripe.customers.create({
        name,
        email,
      });

      await prisma.usuario.update({
        where: { email },
        data: {
          
        }
      });
    } catch (e) {
      if (e instanceof Error) {
        console.error(
          'Erro desconhecido no gateway de pagamento. ' + e.message,
        );
        return res.status(500).json({
          message: 'Ocorreu um erro desconhecido no gateway de pagamento.',
        });
      }
      return res.status(500).json({ message: 'Ocorreu um erro inesperado.' });
    }
  }
}
