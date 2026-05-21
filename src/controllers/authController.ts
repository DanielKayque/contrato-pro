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
      return res
        .status(400)
        .json({ sucess: false, message: 'Dados inválidos.' });
    }

    try {
      const user = await prisma.usuario.findUnique({ where: { email } });

      if (!user) {
        return res
          .status(401)
          .json({ sucess: false, message: 'Usuário ou senha incorretos.' });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);

      if (!passwordCompare) {
        return res
          .status(401)
          .json({ sucess: false, message: 'Usuário ou senha incorretos.' });
      }

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: '1d',
        },
      );
      return res.status(200).json({
        sucess: true,
        data: { message: 'Login realizado com sucesso.', token },
      });
    } catch (err) {
      console.error('Erro interno ' + err);

      return res.status(500).json({
        sucess: false,
        message: 'Ocorreu um erro desconhecido.',
      });
    }
  }
}
