# ContratoPRO

> **Projeto em andamento.** Funcionalidades sendo adicionadas progressivamente.

Plataforma para geração de contratos profissionais em PDF para freelancers e MEIs brasileiros. O usuário preenche um formulário, escolhe o nicho e recebe um contrato pronto para assinar.

🔗 **Demo:** [v0-contrato-pro-front.vercel.app](https://v0-contrato-pro-front.vercel.app)

> ⚠️ A primeira requisição pode levar até **50 segundos** para responder. O backend está hospedado no Render com plano gratuito, que hiberna após inatividade.

---

## Funcionalidades

- Cadastro e autenticação com JWT
- Geração de contrato em PDF por nicho (Dev, Design, Consultoria)
- Limite de 3 contratos/mês no plano gratuito
- Listagem de contratos gerados
- Integração com Stripe para upgrade de plano

---

## Stack

### Frontend
- [Next.js](https://nextjs.org/) — App Router
- [Tailwind CSS](https://tailwindcss.com/)
- TypeScript

### Backend
- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/) + [Prisma ORM](https://www.prisma.io/)
- [Zod](https://zod.dev/) — validação de dados
- [html-pdf-node](https://www.npmjs.com/package/html-pdf-node) — geração de PDF
- JWT + bcrypt — autenticação
- [Stripe](https://stripe.com/) — pagamentos

---

## Estrutura do backend

```
src/
├── controllers/     # AuthController, ContratoController
├── middlewares/     # autenticar.ts, checarPlano.ts
├── routes/          # userRoutes.ts
├── services/        # pdfService.ts
├── templates/       # dev.html, design.html, consultoria.html
└── generated/       # Prisma client
```

---

## Roadmap

- [x] Autenticação (cadastro e login)
- [x] Geração de PDF por nicho
- [x] Limite de contratos por plano
- [ ] Integração Stripe
- [ ] Listagem e histórico de contratos
- [ ] Envio do contrato por link
- [ ] Assinatura digital
- [ ] Dashboard com métricas

---

**Desenvolvido por Daniel Kayque**
