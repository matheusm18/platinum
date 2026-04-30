CREATE TYPE "public"."game_status" AS ENUM('playing', 'completed', 'want_to_play', 'dropped');--> statement-breakpoint
CREATE TABLE "favorites" (
	"user_id" uuid NOT NULL,
	"game_slug" varchar(255) NOT NULL,
	"rank" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "favorites_user_id_game_slug_pk" PRIMARY KEY("user_id","game_slug"),
	CONSTRAINT "favorites_user_id_rank_unique" UNIQUE("user_id","rank"),
	CONSTRAINT "rank_limit" CHECK ("favorites"."rank" IS NULL OR ("favorites"."rank" >= 1 AND "favorites"."rank" <= 5))
);
--> statement-breakpoint
CREATE TABLE "follows" (
	"follower_id" uuid NOT NULL,
	"following_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "follows_follower_id_following_id_pk" PRIMARY KEY("follower_id","following_id"),
	CONSTRAINT "no_self_follow" CHECK ("follows"."follower_id" != "follows"."following_id")
);
--> statement-breakpoint
CREATE TABLE "game_library" (
	"user_id" uuid NOT NULL,
	"game_slug" varchar(255) NOT NULL,
	"status" "game_status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "game_library_user_id_game_slug_pk" PRIMARY KEY("user_id","game_slug")
);
--> statement-breakpoint
CREATE TABLE "games" (
	"slug" varchar(255) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"cover_url" text NOT NULL,
	"description" text,
	"release_year" integer,
	"average_score" integer,
	"genres" text[],
	"platforms" text[],
	"developers" text[],
	"publishers" text[],
	"playtime" integer,
	"website" text,
	"last_synced_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "play_queue" (
	"user_id" uuid NOT NULL,
	"game_slug" varchar(255) NOT NULL,
	"position" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "play_queue_user_id_position_pk" PRIMARY KEY("user_id","position"),
	CONSTRAINT "play_queue_user_id_game_slug_unique" UNIQUE("user_id","game_slug"),
	CONSTRAINT "position_limit" CHECK ("play_queue"."position" >= 1 AND "play_queue"."position" <= 5)
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"user_id" uuid NOT NULL,
	"game_slug" varchar(255) NOT NULL,
	"score" integer NOT NULL,
	"content" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "reviews_user_id_game_slug_pk" PRIMARY KEY("user_id","game_slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"avatar_url" text,
	"avatar_updated_at" timestamp,
	"bio" varchar(150),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_game_slug_games_slug_fk" FOREIGN KEY ("game_slug") REFERENCES "public"."games"("slug") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_id_users_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_following_id_users_id_fk" FOREIGN KEY ("following_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_library" ADD CONSTRAINT "game_library_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_library" ADD CONSTRAINT "game_library_game_slug_games_slug_fk" FOREIGN KEY ("game_slug") REFERENCES "public"."games"("slug") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "play_queue" ADD CONSTRAINT "play_queue_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "play_queue" ADD CONSTRAINT "play_queue_game_slug_games_slug_fk" FOREIGN KEY ("game_slug") REFERENCES "public"."games"("slug") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_game_slug_games_slug_fk" FOREIGN KEY ("game_slug") REFERENCES "public"."games"("slug") ON DELETE cascade ON UPDATE no action;