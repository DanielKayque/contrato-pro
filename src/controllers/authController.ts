import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

type ReqBody = {
  email: string;
  password: string;
};

export class AuthController {
  async login(req: Request<{}, {}, ReqBody>, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Dados inválidos.' });
    }

    try {
      const user = await prisma.usuario.findUnique({ where: { email } });

      if (!user) {
        return res
          .status(401)
          .json({ message: 'Usuário ou senha incorretos.' });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);

      if (!passwordCompare) {
        return res
          .status(401)
          .json({ error: true, message: 'Usuário ou senha incorretos.' });
      }

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: '1d',
        },
      );
      return res.status(200).json({ message: 'Seja bem vindo!', token });
    } catch (err) {
      if (err instanceof Error) {
        console.error('Erro interno ' + err.message);
        return res
          .status(500)
          .json({ message: 'Ocorreu um erro inesperado.' + err.message });
      }
      return res
        .status(500)
        .json({ message: 'Ocorreu um erro desconhecido.' + err });
    }
  }
}
