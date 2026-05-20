import type { Request, Response } from 'express';
import { stripe } from '../lib/stripe.js';
import { prisma } from '../lib/prisma.js';
import {
  emailSchema,
  identifyUserSchema,
} from '../schema/registerUserSchema.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

export default class PaymentController {
  async createClient(req: Request, res: Response) {
    const result = identifyUserSchema.safeParse(req.body);

    if (result.error) {
      return res.status(400).json({
        message: 'Favor verifique os dados e tente novamente',
        error: result.error,
      });
    }

    const { name, email } = result.data;

    try {
      // 1. Verifica primeiro se o usuário existe no banco de dados
      const usuario = await prisma.usuario.findUnique({
        where: { email },
      });

      if (!usuario) {
        return res
          .status(404)
          .json({ message: 'Usuário não encontrado no sistema.' });
      }

      //Evita duplicidade se ele já tiver o ID do Stripe, não cria de novo
      if (usuario.stripe_customer_id) {
        return res.status(200).json({
          message: 'Usuário já possui conta no Stripe.',
          stripeCustomerId: usuario.stripe_customer_id,
        });
      }

      const customer = await stripe.customers.create({
        name,
        email,
      });

      // Salva o ID retornado
      await prisma.usuario.update({
        where: { email },
        data: {
          stripe_customer_id: customer.id,
        },
      });

      return res
        .status(201)
        .json({ message: 'Usuário criado no Stripe com sucesso.' });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          return res.status(404).json({ message: 'Usuário desconhecido.' });
        }
      }
      console.error(err);

      return res
        .status(500)
        .json({ message: 'Ocorreu um erro inesperado no servidor.' });
    }
  }

  async createPaymentIntent(req: Request, res: Response) {
    const result = emailSchema.safeParse(req.body);

    if (result.error) {
      return res.status(404).json({
        message: 'Favor verifique os dados e tente novamente',
        error: result.error,
      });
    }

    try {
      const { email } = result.data;

      const usuario = await prisma.usuario.findUnique({ where: { email } });

      if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      if (!usuario.stripe_customer_id) {
        return res.status(400).json({
          message:
            'Este usuário ainda não possui um perfil de cliente no Stripe. Crie o cliente primeiro.',
        });
      }
      const paymentIntent = await stripe.paymentIntents.create({
        amount: VALOR_PLANO_CENTAVOS,
        currency: 'brl',
        customer: usuario.stripe_customer_id,
        payment_method_types: ['card'], // Você pode adicionar 'pix' aqui se sua conta Stripe estiver configurada para isso
        metadata: {
          // Metadados servem para você guardar fofocas/informações úteis que não mudam o preço.
          // O Stripe salva isso no painel deles. É ótimo para auditoria.
          usuario_id_interno: usuario.id,
        },
      });
    } catch (err) {}
  }
}
