import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";

import * as schema from "./schema";

// Conexão criada só no primeiro uso real (em runtime), não na importação
// do módulo. O Next.js "coleta" as rotas em build time só de importar os
// arquivos — se DATABASE_URL não estiver disponível nesse momento (ex:
// faltando em algum ambiente da Vercel), isso não pode quebrar o build.
let instance: NeonHttpDatabase<typeof schema> | undefined;

function getDb(): NeonHttpDatabase<typeof schema> {
  if (!instance) {
    const sql = neon(process.env.DATABASE_URL!);
    instance = drizzle(sql, { schema });
  }
  return instance;
}

export const db: NeonHttpDatabase<typeof schema> = new Proxy(
  {} as NeonHttpDatabase<typeof schema>,
  {
    get(_target, prop, receiver) {
      return Reflect.get(getDb(), prop, receiver);
    },
  },
);
