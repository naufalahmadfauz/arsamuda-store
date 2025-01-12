CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"title" text NOT NULL,
	"created" timestamp DEFAULT now() NOT NULL,
	"price" real NOT NULL
);
