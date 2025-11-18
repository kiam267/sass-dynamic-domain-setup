// drizzle/schema.ts
import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    password_hash: text('password_hash').notNull(),
    created_at: timestamp('created_at').defaultNow(),
  },
  table => ({
    email_idx: uniqueIndex('users_email_idx').on(
      table.email
    ),
  })
);

export const projects = pgTable(
  'projects',
  {
    id: serial('id').primaryKey(),
    owner_id: serial('owner_id').notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    primary_domain: varchar('primary_domain', {
      length: 255,
    }),
    created_at: timestamp('created_at').defaultNow(),
  },
  t => ({
    slug_idx: uniqueIndex('projects_slug_idx').on(t.slug),
  })
);

export const domains = pgTable('domains', {
  id: serial('id').primaryKey(),
  project_id: serial('project_id').notNull(),
  domain: varchar('domain', { length: 255 }).notNull(),
  verified: text('verified').default('false'),
  created_at: timestamp('created_at').defaultNow(),
});
