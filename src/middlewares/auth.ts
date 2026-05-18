import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

type MyTokenPayload = {
  id: string;
  iat: number;
  exp: number;
};

export class Auth {
  async authentication(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ message: 'Token inválido.' });
    }

    const [, token] = authorization.split(' ') as [string, string];

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string,
      ) as MyTokenPayload;

      const { id } = decoded;

      req.userId = id;

      return next();
    } catch (e) {
      //Tratamento para erro do token
      if (e instanceof jwt.JsonWebTokenError) {
        return res
          .status(401)
          .json({ message: 'Token inválido ou malformatado.' });
        //Tratamento para erro de token expirado
      } else if (e instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: 'Token expirado.' });
      } else if (e instanceof Error) {
        console.error('Erro desconhecido ' + e.message);

        return res.status(500).json({ message: 'Erro desconheido' });
      }
    }
  }
}
