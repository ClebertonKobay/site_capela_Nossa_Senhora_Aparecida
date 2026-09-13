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

// Exceções e escala de celebrante por data específica.
export const celebrations = pgTable("celebrations", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  time: time("time").notNull(),
  celebrant: text("celebrant").notNull(),
  type: activityType("type").notNull(),
  note: text("note"),
  canceled: boolean("canceled").notNull().default(false),
});

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
