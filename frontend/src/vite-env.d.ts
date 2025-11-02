/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // adicione outras variáveis de ambiente aqui se necessário
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
