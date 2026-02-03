import { createCookieSessionStorage, createSessionStorage } from 'react-router';
import { db } from './db.server';
import { session } from 'db/schema';
import { eq } from 'drizzle-orm';

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_session', // use any name you want here
    sameSite: 'lax', // this helps with CSRF
    path: '/', // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: ['wdsadsadd'], // replace this with an actual secret
    secure: process.env.NODE_ENV === 'production', // enable this in prod only
  },
});

/*
https://remix.run/docs/en/main/utils/sessions#createsessionstorage
todo
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TestDBStorage = createSessionStorage({
  async createData(data, expires) {
    console.log('createData', data);
    if (!expires) {
      throw new Error('Expires date is required');
    }
    if (!data.user_id || typeof data.user_id !== 'number') {
      throw new Error('User ID is required');
    }
    const userIDs = await db
      .insert(session)
      .values({
        id: data.id,
        user_id: data.user_id,
        expires: expires,
      })
      .returning({
        id: session.id,
      });
    return userIDs[0].id;
  },
  async deleteData(id) {
    console.log('deleteData', id);
    await db.delete(session).where(eq(session.id, id));
  },
  async readData(id) {
    console.log('readData', id);
    const sessionData = await db
      .select()
      .from(session)
      .where(eq(session.id, id));
    return sessionData[0];
  },
  async updateData(id, data, expires) {
    console.log('updateData', id, data, expires);
    await db
      .update(session)
      .set({
        user_id: data.user_id,
        expires: expires,
      })
      .where(eq(session.id, id));
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
