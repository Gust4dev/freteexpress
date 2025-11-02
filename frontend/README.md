# Frete Express — Frontend

Frontend da plataforma **Frete Express**, responsável pela interface web, autenticação e interação com as APIs do backend.

---

## ⚡ Quickstart

```bash
# 1. Configuração do ambiente
cp .env.example .env   # preencha as variáveis necessárias

# 2. Instalação de dependências
pnpm install

# 3. Executar em modo desenvolvimento
pnpm dev

# 4. Build para produção
pnpm build
```

---

## 📂 Estrutura

- `src/pages/*` — páginas principais da aplicação
- `src/components/*` — componentes reutilizáveis de UI
- `src/api/*` — clientes para comunicação com o backend
- `src/hooks/*` — hooks customizados
- `src/utils/*` — funções utilitárias
- `src/styles/*` — estilos globais e configurações do Tailwind
- `public/` — arquivos estáticos

---

## 🛠️ Tecnologias Utilizadas

- [React](https://react.dev/) — biblioteca principal de UI
- [Vite](https://vitejs.dev/) — bundler e dev server
- [TypeScript](https://www.typescriptlang.org/) — tipagem estática
- [Tailwind CSS](https://tailwindcss.com/) — utilitários de CSS
- [PNPM](https://pnpm.io/) — gerenciador de pacotes

---

## 📜 Scripts Disponíveis

| Comando        | Descrição                            |
| -------------- | ------------------------------------ |
| `pnpm dev`     | Inicia o servidor de desenvolvimento |
| `pnpm build`   | Gera o build de produção             |
| `pnpm preview` | Visualiza o build localmente         |
| `pnpm lint`    | (Se configurado) Lint no código      |

---

## 🌱 Variáveis de Ambiente

Configure o arquivo `.env` com as variáveis necessárias para integração com o backend e outros serviços. Veja `.env.example` para referência.

---

## 🧩 Integração com Backend

O frontend espera que o backend esteja rodando e acessível via URL definida nas variáveis de ambiente. As chamadas à API são feitas via arquivos em `src/api/`.

---

## ⚠️ Aviso

Este frontend está em **fase de protótipo**.
Funcionalidades e integrações podem sofrer alterações até a versão final.

---
