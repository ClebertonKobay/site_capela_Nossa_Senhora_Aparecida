import { db } from "./index";
import { fixedSchedules } from "./schema";

async function seed() {
  await db.insert(fixedSchedules).values([
    {
      weekday: 0, // domingo
      time: "10:00",
      description: "Santa Missa",
    },
    {
      weekday: 1, // segunda
      time: "20:00",
      description: "Grupo de Oração Porta do Céu",
    },
    {
      weekday: 3, // quarta
      time: "19:00",
      description: "Novena em Honra a Nossa Senhora Aparecida",
    },
    {
      weekday: 6, // sábado
      time: "08:30",
      description: "Catequese — 1º e 4º tempo",
    },
    {
      weekday: 6, // sábado
      time: "10:00",
      description: "Catequese — 2º e 3º tempo",
    },
    {
      weekday: 4, // quinta
      time: "15:00",
      description: "Catequese — 5º tempo",
    },
    {
      weekday: 2, // terça
      time: "19:30",
      description: "Catequese de Adultos (Catecúmenos)",
    },
  ]);

  console.log("Seed de fixed_schedules concluído.");
}

seed();
