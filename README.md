# 🚀 ContratoPRO — Plataforma de Gestão de Contratos

O **ContratoPRO** é uma solução Full Stack moderna para criação e gestão de contratos profissionais para freelancers e MEIs brasileiros.

Neste projeto, desenvolvi toda a API do zero, desenhando a arquitetura de dados e regras de negócio para garantir segurança e performance. Já o frontend foi construído com **Next.js**, resultando em uma interface minimalista, responsiva e com foco na experiência do usuário.

---
## 📸 Imagens do projeto:

<img width="1895" height="903" alt="Captura de tela 2026-05-26 123918" src="https://github.com/user-attachments/assets/91a325f2-e23d-4f8e-92d2-33a0a615a3c9" />
<img width="1898" height="903" alt="Captura de tela 2026-05-26 123935" src="https://github.com/user-attachments/assets/625c1166-74b2-403c-abff-09607dee62d6" />
<img width="1916" height="906" alt="image" src="https://github.com/user-attachments/assets/2633fe0d-ef48-4256-9fc8-c1b3af9f23e5" />
<img width="1896" height="900" alt="image" src="https://github.com/user-attachments/assets/58ee8496-f359-4b61-9748-be44ff276df2" />


## 🛠️ Stack

**Backend (API)**
Node.js · Express · TypeScript · Prisma ORM · PostgreSQL · JWT · Zod · html-pdf-node · Stripe

**Frontend**
Next.js · React · Tailwind CSS · TypeScript

---

## 📚 Endpoints principais

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `POST` | `/register` | Criação de novo usuário | ✅ |
| `POST` | `/login` | Autenticação e retorno do token JWT | ❌ |
| `GET` | `/auth/me` | Retorna dados do usuário logado | ✅ |
| `POST` | `/contratos/gerar` | Geração de contrato em PDF | ✅ |
| `GET` | `/contratos` | Listagem dos contratos do usuário | ✅ |
| `POST` | `/customers` | Criação de assinatura via Stripe | ✅ |
| `POST` | `/payment` | Realizar intenção de pagamento via Stripe | ✅ |
| `POST` | `/payment/confirm` | Confirmar pagamento via Stripe | ✅ |

---

## 🌍 Links

- **Frontend:** [v0-contrato-pro-front.vercel.app](https://v0-contrato-pro-front.vercel.app)
- **API:** [contrato-pro-u0zt.onrender.com](https://contrato-pro-u0zt.onrender.com)

> ⚠️ A primeira requisição pode levar até **50 segundos**. O backend está hospedado no Render com plano gratuito, que hiberna após inatividade.

---

## 👨‍💻 Autor

**Daniel Kayque**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/daniel-kayque/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/DanielKayque)
