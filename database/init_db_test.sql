
CREATE DATABASE currencytest;
\connect currencytest;
CREATE USER testuser WITH PASSWORD 'test-pass';

CREATE SEQUENCE currencies_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 4 CACHE 1;

CREATE TABLE "public"."currencies" (
    "id" integer DEFAULT nextval('currencies_id_seq') NOT NULL,
    "name" character varying(50) NOT NULL,
    "value" double precision NOT NULL
) WITH (oids = false);

INSERT INTO "currencies" ("id", "name", "value") VALUES
(2,	'DASH',	0.06756612),
(1,	'XRP',	2.001e-05),
(3,	'LTC',	0.00592855),
(4,	'ETH',	0.04791411);

CREATE SEQUENCE tokens_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 2 CACHE 1;

CREATE TABLE "public"."tokens" (
    "id" integer DEFAULT nextval('tokens_id_seq') NOT NULL,
    "user_id" integer NOT NULL,
    "token" character varying(100) NOT NULL,
    "expires_at" integer NOT NULL
) WITH (oids = false);


CREATE SEQUENCE user_credit_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 9 CACHE 1;

CREATE TABLE "public"."usercredits" (
    "id" integer DEFAULT nextval('user_credit_id_seq') NOT NULL,
    "currency_id" integer NOT NULL,
    "amount" double precision NOT NULL,
    "user_id" integer NOT NULL
) WITH (oids = false);


CREATE SEQUENCE user_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 12 CACHE 1;

CREATE TABLE "public"."users" (
    "id" integer DEFAULT nextval('user_id_seq') NOT NULL,
    "name" character varying(100) NOT NULL,
    "surname" character varying(100) NOT NULL,
    "email" character varying(100) NOT NULL,
    "password" character varying(150) NOT NULL
) WITH (oids = false);
    
GRANT ALL PRIVILEGES ON DATABASE currencytest TO testuser;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public to testuser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public to testuser;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public to testuser;