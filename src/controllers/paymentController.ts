import type { Request, Response } from 'express';
import { stripe } from '../lib/stripe.js';
import { prisma } from '../lib/prisma.js';
import {
  emailSchema,
  identifyUserSchema,
  paymentIntentSchema,
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
          success: false,
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

      return res.status(201).json({
        success: true,
        message: 'Usuário criado no Stripe com sucesso.',
        stripeCustomerId: customer.id,
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          return res.status(404).json({ message: 'Usuário desconhecido.' });
        }
      }
      console.error(err);

      return res.status(500).json({
        success: false,
        message: 'Ocorreu um erro inesperado no servidor.',
      });
    }
  }

  async createPaymentIntent(req: Request, res: Response) {
    const result = paymentIntentSchema.safeParse(req.body);

    if (result.error) {
      return res.status(404).json({
        success: false,
        message: 'Favor verifique os dados e tente novamente',
        error: result.error,
      });
    }

    try {
      const { email, priceId } = result.data;

      const usuario = await prisma.usuario.findUnique({ where: { email } });

      if (!usuario) {
        return res
          .status(404)
          .json({ success: false, message: 'Usuário não encontrado' });
      }

      if (!usuario.stripe_customer_id) {
        return res.status(400).json({
          success: false,
          message:
            'Este usuário ainda não possui um perfil de cliente no Stripe. Crie o cliente primeiro.',
        });
      }

      //Busca o preço em tempo real
      const stripePrice = await stripe.prices.retrieve(priceId);

      if (!stripePrice.unit_amount) {
        return res.status(400).json({
          success: false,
          message: 'Esse item não possui um valor especificado.',
        });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: stripePrice.unit_amount,
        currency: stripePrice.currency,
        customer: usuario.stripe_customer_id,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          usuario_id_interno: usuario.id,
        },
      });

      return res.status(201).json({
        success: true,
        message: 'Intenção de pagamento gerada com sucesso.',
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: 'Ocorreu um erro ao gerar a intenção de pagamento.',
        error: err,
      });
    }
  }

  async confirmPaymentIntent(req: Request, res: Response) {
    try {
      const { paymentIntentId } = req.body;

      const confirmed = await stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: 'pm_card_visa',
      });

      return res.status(200).json({
        success: true,
        status: confirmed.status,
        data: confirmed,
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        success: false,
        message: 'Erro ao confirmar pagamento',
      });
    }
  }
}
