CREATE TABLE "play_queue" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"game_slug" varchar(255) NOT NULL,
	"position" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "play_queue_user_id_position_unique" UNIQUE("user_id","position"),
	CONSTRAINT "position_limit" CHECK ("play_queue"."position" >= 1 AND "play_queue"."position" <= 5)
);
--> statement-breakpoint
ALTER TABLE "play_queue" ADD CONSTRAINT "play_queue_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;