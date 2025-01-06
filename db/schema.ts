import { sql } from 'drizzle-orm';
import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  pgEnum,
  unique,
  integer,
} from 'drizzle-orm/pg-core';

export const shareStatus = pgEnum('shareStatus', ['private', 'public']);
export const userRole = pgEnum('userRole', ['admin', 'user']);
export const loopDuration = pgEnum('loopDuration', [
  'daily',
  'weekly',
  'monthly',
  'yearly',
]);

export const user = pgTable(
  'userdata',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    role: userRole('role').default('user'),
  },
  (t) => {
    return {
      user_unique: unique('user_unq').on(t.email, t.id),
    };
  },
);

export const list = pgTable(
  'list',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').default(''),
    owner_id: integer('owner_id')
      .notNull()
      .references(() => user.id),
    shareStatus: shareStatus('shareStatus').default('private'),
    shareWith: integer('shareWith')
      .array()
      .default(sql`'{}'::integer[]`),
  },
  (t) => ({
    list_unique: unique('list_unq').on(t.title, t.owner_id),
  }),
);

export const todoListLinkToEvent = pgTable('todoListLinkToEvent', {
  id: serial('id').primaryKey(),
  list_id: serial('list_id')
    .notNull()
    .references(() => list.id, { onDelete: 'cascade' }),
  event_id: serial('event_id')
    .notNull()
    .references(() => event.id, { onDelete: 'cascade' }),
});

export const event = pgTable('event', {
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

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  user_id: serial('user_id')
    .notNull()
    .references(() => user.id),
  expires: timestamp('expires').notNull(),
});

export const ShareID = pgTable('ShareID', {
  id: serial('id').primaryKey(),
  share_id: text('share_id').notNull(),
  list_id: serial('list_id')
    .notNull()
    .references(() => list.id, { onDelete: 'cascade' }),
});

export const finishState = pgTable(
  'finishState',
  {
    id: serial('id').primaryKey(),
    user_id: integer('user_id')
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

export const chatSession = pgTable('chatSession', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  history: text('history')
    .array()
    .default(sql`'{}'::text[]`),
  count: integer('count').default(10),
});
