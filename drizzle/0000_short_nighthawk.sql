CREATE TABLE IF NOT EXISTS "picklejar_account" (
	"userId" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"providerAccountId" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "picklejar_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "picklejar_match" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"gameType" varchar(50) NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"time" varchar(10) NOT NULL,
	"location" varchar(255) NOT NULL,
	"outcome" varchar(10) NOT NULL,
	"scores" jsonb NOT NULL,
	"participants" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "picklejar_playerStats" (
	"id" serial PRIMARY KEY NOT NULL,
	"playerId" varchar(255) NOT NULL,
	"totalMatches" integer DEFAULT 0 NOT NULL,
	"wins" integer DEFAULT 0 NOT NULL,
	"losses" integer DEFAULT 0 NOT NULL,
	"eloRating" integer DEFAULT 1500 NOT NULL,
	"totalPoints" integer DEFAULT 0 NOT NULL,
	"lastUpdated" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "picklejar_player" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"screenName" varchar(255) NOT NULL,
	"realName" varchar(255),
	"skillLevel" varchar(50),
	"paddleBrand" varchar(100),
	"paddlePreference" varchar(100),
	"plays" varchar(50),
	"homeCourt" varchar(255),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "picklejar_session" (
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "picklejar_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "picklejar_verificationToken" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "picklejar_verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "picklejar_account" ADD CONSTRAINT "picklejar_account_userId_picklejar_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."picklejar_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "picklejar_playerStats" ADD CONSTRAINT "picklejar_playerStats_playerId_picklejar_player_id_fk" FOREIGN KEY ("playerId") REFERENCES "public"."picklejar_player"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "picklejar_player" ADD CONSTRAINT "picklejar_player_userId_picklejar_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."picklejar_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "picklejar_session" ADD CONSTRAINT "picklejar_session_userId_picklejar_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."picklejar_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "picklejar_account" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "match_date_idx" ON "picklejar_match" ("date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "playerStats_playerId_idx" ON "picklejar_playerStats" ("playerId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "player_userId_idx" ON "picklejar_player" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "player_screenName_idx" ON "picklejar_player" ("screenName");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "picklejar_session" ("userId");