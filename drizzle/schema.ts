// lib/schema.ts
import {
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 })
    .notNull()
    .unique(),
  passwordHash: varchar('password_hash', {
    length: 1024,
  }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const tenants = pgTable('tenants', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').notNull(), // FK not enforced here but store relation
  name: varchar('name', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const domains = pgTable('domains', {
  id: serial('id').primaryKey(),
  tenantId: serial('tenant_id').notNull(),
  domain: varchar('domain', { length: 255 })
    .notNull()
    .unique(),
  isPrimary: boolean('is_primary').default(false).notNull(),
  verified: boolean('verified').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
