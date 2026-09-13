import { readFileSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

// O Next.js carrega .env.local sozinho em runtime, mas o drizzle-kit roda
// fora do Next — sem dotenv como dependência, lemos o arquivo na mão aqui.
function envLocal(key: string): string {
  if (process.env[key]) return process.env[key]!;
  const content = readFileSync(".env.local", "utf8");
  const match = content.match(new RegExp(`^${key}="?(.*?)"?$`, "m"));
  if (!match || !match[1]) {
    throw new Error(`${key} não encontrado em .env.local`);
  }
  return match[1];
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: envLocal("DATABASE_URL"),
  },
});
