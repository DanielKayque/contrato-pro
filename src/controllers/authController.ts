import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { registerUserSchema } from '../schema/registerUserSchema.js';
import z from 'zod';

type ReqBody = {
  email: string;
  password: string;
};

export class AuthController {
  async login(req: Request<{}, {}, ReqBody>, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Dados inválidos.' });
    }

    try {
      const user = await prisma.usuario.findUnique({ where: { email } });

      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: 'Usuário ou senha incorretos.' });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);

      if (!passwordCompare) {
        return res
          .status(401)
          .json({ success: false, message: 'Usuário ou senha incorretos.' });
      }

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: '1d',
        },
      );

      return res.status(200).json({
        success: true,
        data: { message: 'Login realizado com sucesso.', token },
      });
    } catch (err) {
      console.error('Erro interno ' + err);

      return res.status(500).json({
        success: false,
        message: 'Ocorreu um erro desconhecido.',
      });
    }
  }
  async register(req: Request, res: Response) {
    //Validamos os dados no ZOD
    try {
      const result = registerUserSchema.safeParse(req.body);

      if (result.error) {
        const errorTree = z.treeifyError(result.error);

        const fieldErrors = Object.fromEntries(
          Object.entries(errorTree.properties || {}).map(([field, value]) => [
            field,
            value.errors[0] ?? 'Campo inválido',
          ]),
        );

        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          error: fieldErrors,
        });
      }

      const { email, name, password } = result.data;

      const senhaHash = await bcrypt.hash(password, 10);

      const usuario = await prisma.usuario.create({
        data: {
          email,
          name,
          password: senhaHash,
        },
        select: {
          name: true,
          email: true,
        },
      });

      return res.status(201).json({
        success: true,
        message: 'Usuário criado com sucesso.',
        data: usuario,
      });
    } catch (err: unknown) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          return res.status(409).json({
            success: false,
            message: 'Esse email já existe',
          });
        }
      }
      return res
        .status(500)
        .json({ success: false, message: 'Ocorreu um erro inesperado.' });
    }
  }

  async authMe(req: Request, res: Response) {
    try {
      const user = await prisma.usuario.findUnique({
        where: { id: req.userId },
        select: {
          id: true,
          name: true,
          plano: true,
          email: true,
          criado_em: true,
        },
      });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'Usuário não encontrado.' });
      }
      return res.status(200).json({ success: true, data: user });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Erro interno.' });
    }
  }
}
