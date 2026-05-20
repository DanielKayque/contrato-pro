import { z } from 'zod';

export const registerUserSchema = z.object({
  name: z
    .string()
    .min(3, 'O nome deverá conter pelo menos 3 caracteres.')
    .max(50, 'O nome é muito longo'),
  email: z.email('Por favor digite um e-mail válido.'),
  password: z
    .string()
    .min(6, 'A senha deverá conter pelo menos 6 caracteres.')
    .regex(/[0-9]/, 'A senha deverá conter pelo menos um número.')
    .regex(
      /[!@#$%^&*()_|~\-]/,
      'A senha deverá conter pelo menos um caractere especial.',
    ),
});

export const identifyUserSchema = registerUserSchema.omit({ password: true });

export const emailSchema = registerUserSchema.pick({ email: true });

export type registerUserType = z.infer<typeof registerUserSchema>;
