import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

type ReqBody = {
  email: string;
  password: string;
};

export class Auth {
  async login(req: Request<{}, {}, ReqBody>, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Dados inválidos.' });
    }

    const user = await prisma.usuario.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'Usuário ou senha incorretos.' });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
      return res
        .status(401)
        .json({ error: true, message: 'Usuário ou senha incorretos.' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '1d',
    });
  }
}
