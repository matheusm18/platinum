import { pgTable, uuid, varchar, text, integer, timestamp, unique, check, pgEnum, primaryKey } from "drizzle-orm/pg-core";
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

export const games = pgTable("games", {
  slug:         varchar("slug", { length: 255 }).primaryKey(),
  title:        text("title").notNull(),
  coverUrl:     text("cover_url").notNull(),
  description:  text("description"),
  releaseYear:  integer("release_year"),
  averageScore: integer("average_score"),
  genres:       text("genres").array(),
  platforms:    text("platforms").array(),
  developers:   text("developers").array(),
  publishers:   text("publishers").array(),
  playtime:     integer("playtime"),
  website:      text("website"),
  lastSyncedAt: timestamp("last_synced_at").defaultNow(),
});

export const follows = pgTable("follows", {
  followerId:  uuid("follower_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  followingId: uuid("following_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt:   timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  primaryKey({ columns: [table.followerId, table.followingId] }),
  check("no_self_follow", sql`${table.followerId} != ${table.followingId}`),
]);

export const gameLibrary = pgTable("game_library", {
  userId:    uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  gameSlug:  varchar("game_slug", { length: 255 }).notNull().references(() => games.slug, { onDelete: "cascade" }),
  status:    gameStatusEnum("status").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  primaryKey({ columns: [table.userId, table.gameSlug] }),
]);

export const reviews = pgTable("reviews", {
  userId:    uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  gameSlug:  varchar("game_slug", { length: 255 }).notNull().references(() => games.slug, { onDelete: "cascade" }),
  score:     integer("score").notNull(),
  content:   text("content"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  primaryKey({ columns: [table.userId, table.gameSlug] }),
]);

export const favorites = pgTable("favorites", {
  userId:    uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  gameSlug:  varchar("game_slug", { length: 255 }).notNull().references(() => games.slug, { onDelete: "cascade" }),
  rank:      integer("rank").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  primaryKey({ columns: [table.userId, table.rank] }),
  unique().on(table.userId, table.gameSlug),
  check("rank_limit", sql`${table.rank} >= 1 AND ${table.rank} <= 5`),
]);

export const playQueue = pgTable("play_queue", {
  userId:    uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  gameSlug:  varchar("game_slug", { length: 255 }).notNull().references(() => games.slug, { onDelete: "cascade" }),
  position:  integer("position").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  primaryKey({ columns: [table.userId, table.position] }),
  unique().on(table.userId, table.gameSlug),
  check("position_limit", sql`${table.position} >= 1 AND ${table.position} <= 5`),
]);