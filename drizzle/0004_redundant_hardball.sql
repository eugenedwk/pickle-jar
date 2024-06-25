ALTER TABLE "picklejar_location" ADD COLUMN "created_by" varchar(255) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "picklejar_location" ADD CONSTRAINT "picklejar_location_created_by_picklejar_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."picklejar_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
