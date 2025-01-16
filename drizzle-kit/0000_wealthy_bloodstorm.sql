CREATE TYPE "public"."auth_method_type" AS ENUM('local', 'google');--> statement-breakpoint
CREATE TABLE "auth_methods" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "auth_methods_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_username" text NOT NULL,
	"type" "auth_method_type" NOT NULL,
	CONSTRAINT "auth_methods_user_username_type_unique" UNIQUE("user_username","type")
);
--> statement-breakpoint
CREATE TABLE "google_auth" (
	"id" integer PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "google_auth_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "local_auth" (
	"id" integer PRIMARY KEY NOT NULL,
	"password" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"username" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
ALTER TABLE "auth_methods" ADD CONSTRAINT "auth_methods_user_username_users_username_fk" FOREIGN KEY ("user_username") REFERENCES "public"."users"("username") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "google_auth" ADD CONSTRAINT "google_auth_id_auth_methods_id_fk" FOREIGN KEY ("id") REFERENCES "public"."auth_methods"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "local_auth" ADD CONSTRAINT "local_auth_id_auth_methods_id_fk" FOREIGN KEY ("id") REFERENCES "public"."auth_methods"("id") ON DELETE cascade ON UPDATE cascade;