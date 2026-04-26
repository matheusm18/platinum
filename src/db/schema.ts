import { pgTable, uuid, varchar, text, integer, timestamp, unique, check, pgEnum } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql/sql";

export const gameStatusEnum = pgEnum("game_status", ["playing", "completed", "want_to_play", "dropped"]);

export const users = pgTable("users", {
  id:              uuid("id").primaryKey().defaultRandom(),
  username:        varchar("username", { length: 50 }).notNull().unique(),
  email:           varchar("email", { length: 255 }).notNull().unique(),
  passwordHash:    text("password_hash").notNull(),
  avatarUrl:       text("avatar_url"),
  avatarUpdatedAt: timestamp("avatar_updated_at"),
  bio:             varchar("bio", { length: 150 }),
  createdAt:       timestamp("created_at").notNull().defaultNow(),
});

export const follows = pgTable("follows", {
  id:          uuid("id").primaryKey().defaultRandom(),
  followerId:  uuid("follower_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  followingId: uuid("following_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt:   timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  unique().on(table.followerId, table.followingId),
  check("no_self_follow", sql`${table.followerId} != ${table.followingId}`),
]);

export const gameLibrary = pgTable("game_library", {
  id:        uuid("id").primaryKey().defaultRandom(),
  userId:    uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  gameSlug:  varchar("game_slug", { length: 255 }).notNull(),
  status:    gameStatusEnum("status").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  unique().on(table.userId, table.gameSlug),
]);

export const reviews = pgTable("reviews", {
  id:        uuid("id").primaryKey().defaultRandom(),
  userId:    uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  gameSlug:  varchar("game_slug", { length: 255 }).notNull(),
  score:     integer("score").notNull(),
  content:   text("content"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
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

export const playQueue = pgTable("play_queue", {
  id:        uuid("id").primaryKey().defaultRandom(),
  userId:    uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  gameSlug:  varchar("game_slug", { length: 255 }).notNull(),
  position:  integer("position").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  unique().on(table.userId, table.position),
  unique().on(table.userId, table.gameSlug),
  check("position_limit", sql`${table.position} >= 1 AND ${table.position} <= 5`),
]);