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

export const user = pgTable('userdata', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull(),
	role: userRole('role').default('user'),
});

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
	end_date: timestamp('end_date'),
	creater_id: integer('creater_id')
});

export const session = pgTable('session', {
	id: serial('id').primaryKey(),
	user_id: serial('user_id')
		.notNull()
		.references(() => user.id),
	expires: timestamp('expires').notNull(),
});
