import { relations, sql } from 'drizzle-orm';
import {
  serial,
  text,
  timestamp,
  boolean,
  unique,
  integer,
  index,
  PgSchema,
} from 'drizzle-orm/pg-core';

export const schema = new PgSchema('todo_app');

export const shareStatus = schema.enum('shareStatus', ['private', 'public']);
export const userRole = schema.enum('userRole', ['admin', 'user']);
export const loopDuration = schema.enum('loopDuration', [
  'daily',
  'weekly',
  'monthly',
  'yearly',
]);

export const user = schema.table('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),

  role: userRole('role').default('user'),
});

export const session = schema.table(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [index('session_userId_idx').on(table.userId)],
);

export const account = schema.table(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('account_userId_idx').on(table.userId)],
);

export const verification = schema.table(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const list = schema.table(
  'list',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').default(''),
    owner_id: text('owner_id')
      .notNull()
      .references(() => user.id),
    shareStatus: shareStatus('shareStatus').default('private'),
    shareWith: text('shareWith')
      .array()
      .default(sql`'{}'::text[]`),
  },
  (t) => ({
    list_unique: unique('list_unq').on(t.title, t.owner_id),
  }),
);

export const todoListLinkToEvent = schema.table('todoListLinkToEvent', {
  id: serial('id').primaryKey(),
  list_id: serial('list_id')
    .notNull()
    .references(() => list.id, { onDelete: 'cascade' }),
  event_id: serial('event_id')
    .notNull()
    .references(() => event.id, { onDelete: 'cascade' }),
});

export const event = schema.table('event', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  is_long_time: boolean('is_long_time').default(false),
  start_date: timestamp('start_date').notNull().defaultNow(),
  loop: boolean('loop').default(false),
  loop_duration: loopDuration('loop_duration').default('daily'),
  end_date: timestamp('end_date'),
  creater_id: integer('creater_id'),
});

export const ShareID = schema.table('ShareID', {
  id: serial('id').primaryKey(),
  share_id: text('share_id').notNull(),
  list_id: serial('list_id')
    .notNull()
    .references(() => list.id, { onDelete: 'cascade' }),
});

export const finishState = schema.table(
  'finishState',
  {
    id: serial('id').primaryKey(),
    user_id: text('user_id')
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
      }),
    event_id: integer('event_id')
      .notNull()
      .references(() => event.id, {
        onDelete: 'cascade',
      }),
    finish: boolean('finish').default(false),
  },
  (table) => ({
    finishState_unique: unique('finishState_unq').on(
      table.user_id,
      table.event_id,
    ),
  }),
);

export const chatSession = schema.table('chatSession', {
  id: serial('id').primaryKey(),
  user_id: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  history: text('history')
    .array()
    .default(sql`'{}'::text[]`),
  count: integer('count').default(10),
});
