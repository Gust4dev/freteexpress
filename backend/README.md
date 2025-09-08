# Frete Express — Backend

Backend inicial da plataforma **Frete Express**, responsável pelas APIs, lógica de negócios e integrações externas.

---

## ⚡ Quickstart

```bash
# 1. Configuração do ambiente
cp .env.example .env   # preencha suas chaves

# 2. Instalação de dependências
npm install

# 3. Subir MongoDB via Docker
docker-compose up -d mongo

# 4. Executar em modo desenvolvimento
npm run dev

# 5. Rodar testes (Jest + Supertest)
npm test
```

---

## 📂 Estrutura

* `src/modules/*` — funcionalidades organizadas por domínio
* `src/libs/antt.ts` — protótipo para cálculo de piso mínimo ANTT
* `tests/` — testes unitários e de integração

---

## ⚠️ Aviso

Este backend está em **fase de protótipo**.
Integrações reais (ex.: ANTT oficial, Stripe, insurtechs) ainda precisam ser implementadas antes do uso em produção.

---
