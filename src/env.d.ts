/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  /** Personal Access Token de Airtable (pat…). Sin él, la web usa datos de ejemplo. */
  readonly AIRTABLE_TOKEN?: string;
  /** ID de la base de Airtable (app…). */
  readonly AIRTABLE_BASE_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
