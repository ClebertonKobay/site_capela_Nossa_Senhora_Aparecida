// Bootstrap do primeiro usuário admin. Resolve o problema do ovo e da
// galinha: cria a primeira linha em `users` sem precisar de uma UI que
// exigiria já estar logado como admin para funcionar.
//
// Uso:
//   node --env-file=.env.local scripts/create-admin-user.mjs <username> <nome> <senha>
import { hash } from "@node-rs/argon2";
import { neon } from "@neondatabase/serverless";

const [username, name, password] = [
  process.argv[2],
  process.argv[3],
  process.argv[4],
];

if (!username || !name || !password) {
  console.error(
    "Uso: node scripts/create-admin-user.mjs <username> <nome> <senha>",
  );
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error("Erro: variável de ambiente DATABASE_URL não definida.");
  process.exit(1);
}

const passwordHash = await hash(password);

const sql = neon(process.env.DATABASE_URL);

// Template tag do driver Neon parametriza sozinho — nunca concatenar SQL.
const result = await sql`
  insert into users (username, name, password_hash, role)
  values (${username}, ${name}, ${passwordHash}, 'admin')
  on conflict (username) do nothing
  returning id
`;

if (result.length > 0) {
  console.log(`Usuário "${username}" criado com sucesso (id ${result[0].id}).`);
} else {
  console.log(`Usuário "${username}" já existia — nenhuma alteração feita.`);
}
