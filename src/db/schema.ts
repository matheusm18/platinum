import { pgTable, uuid, varchar, text, integer, timestamp, unique, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql/sql";

export const users = pgTable("users", {
  id:           uuid("id").primaryKey().defaultRandom(),
  username:     varchar("username", { length: 50 }).notNull().unique(),
  email:        varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  avatarUrl:    text("avatar_url"),
  bio:          varchar("bio", { length: 150 }),
  createdAt:    timestamp("created_at").notNull().defaultNow(),
});

export const reviews = pgTable("reviews", {
  id:        uuid("id").primaryKey().defaultRandom(),
  userId:    uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  gameSlug:  varchar("game_slug", { length: 255 }).notNull(),
  score:     integer("score").notNull(),
  content:   text("content"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  unique().on(table.userId, table.gameSlug),
]);

export const favorites = pgTable("favorites", {
  id:        uuid("id").primaryKey().defaultRandom(),
  userId:    uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  gameSlug:  varchar("game_slug", { length: 255 }).notNull(),
  rank:      integer("rank").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  unique().on(table.userId, table.rank),
  check("rank_limit", sql`${table.rank} >= 1 AND ${table.rank} <= 5`),
]);