import type { Request, Response } from 'express';
import z from 'zod';
import { registerUserSchema } from '../schema/registerUserSchema.js';
import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

export class UserController {
  async criarUsuario(req: Request, res: Response) {
    //Validamos os dados no ZOD
    try {
      const result = registerUserSchema.safeParse(req.body);

      if (result.error) {
        const errorTree = z.treeifyError(result.error);

        return res.status(400).json({
          success: false,
          message: errorTree,
          error: errorTree.errors,
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

      return res
        .status(201)
        .json({
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
}
