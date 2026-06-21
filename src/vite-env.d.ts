/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Dev-only flag to render the update banner with a fake available update. */
  readonly VITE_FAKE_UPDATE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
