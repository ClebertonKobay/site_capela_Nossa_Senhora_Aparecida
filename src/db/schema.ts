import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  time,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

// Compartilhado entre fixed_schedules e celebrations. celebrations, na
// prática, só usa mass/rosary/novena (as que têm celebrante definido).
export const activityType = pgEnum("celebration_type", [
  "mass",
  "rosary",
  "novena",
  "prayer_group",
  "catechism",
]);

// A grade semanal fixa, que quase nunca muda.
export const fixedSchedules = pgTable("fixed_schedules", {
  id: serial("id").primaryKey(),
  weekday: integer("weekday").notNull(), // 0 = domingo ... 6 = sábado
  time: time("time").notNull(),
  description: text("description").notNull(),
  type: activityType("type").notNull(),
  active: boolean("active").notNull().default(true),
});

// Exceções e escala de celebrante por data específica. Uma linha por
// data+horário+tipo — permite upsert (ex: marcar "cancelada" sem
// ainda ter definido o celebrante).
export const celebrations = pgTable(
  "celebrations",
  {
    id: serial("id").primaryKey(),
    date: date("date").notNull(),
    time: time("time").notNull(),
    celebrant: text("celebrant"),
    type: activityType("type").notNull(),
    note: text("note"),
    canceled: boolean("canceled").notNull().default(false),
  },
  (table) => [unique().on(table.date, table.time, table.type)],
);

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  startAt: timestamp("start_at", { withTimezone: true }).notNull(),
  endAt: timestamp("end_at", { withTimezone: true }),
  location: text("location"),
  whatsappPhone: text("whatsapp_phone").notNull(), // só dígitos, com DDI
  cardPrice: integer("card_price"), // em centavos
  sellsCards: boolean("sells_cards").notNull().default(false),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const cardOrders = pgTable("card_orders", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id")
    .notNull()
    .references(() => events.id),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  quantity: integer("quantity").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const userRole = pgEnum("user_role", [
  "admin",
  "chapel_coordinator",
  "pastoral_coordinator",
  "catechesis_coordinator",
  "catechist",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: userRole("role").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  pastoralId: integer("pastoral_id").references(() => pastorals.id),
});

export const pastorals = pgTable("pastorals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const pastoralMembers = pgTable("pastoral_members", {
  id: serial("id").primaryKey(),
  pastoralId: integer("pastoral_id")
    .notNull()
    .references(() => pastorals.id),
  name: text("name").notNull(),
  phone: text("phone"),
  notes: text("notes"),
  active: boolean("active").notNull().default(true),
});

export const catechismClasses = pgTable("catechism_classes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  catechistId: integer("catechist_id").references(() => users.id),
  weekday: integer("weekday").notNull(), // 0 = domingo ... 6 = sábado
  time: time("time").notNull(),
  active: boolean("active").notNull().default(true),
});

export const catechumens = pgTable("catechumens", {
  id: serial("id").primaryKey(),
  classId: integer("class_id")
    .notNull()
    .references(() => catechismClasses.id),
  name: text("name").notNull(),
  guardianName: text("guardian_name"),
  guardianPhone: text("guardian_phone"),
  active: boolean("active").notNull().default(true),
});

export const catechismAttendance = pgTable(
  "catechism_attendance",
  {
    id: serial("id").primaryKey(),
    classId: integer("class_id")
      .notNull()
      .references(() => catechismClasses.id),
    catechumenId: integer("catechumen_id")
      .notNull()
      .references(() => catechumens.id),
    date: date("date").notNull(),
    present: boolean("present").notNull(),
  },
  (table) => [unique().on(table.classId, table.catechumenId, table.date)],
);
