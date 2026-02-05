/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import 'dotenv/config';
import { PassThrough } from 'node:stream';

import type { AppLoadContext, EntryContext } from 'react-router';
import { createReadableStreamFromReadable } from '@react-router/node';
import { ServerRouter } from 'react-router';
import { isbot } from 'isbot';
import { renderToPipeableStream } from 'react-dom/server';
import { db } from './services/db.server';
import { event, chatSession } from 'db/schema';
import { and, eq, lt, or, isNotNull } from 'drizzle-orm';

const ABORT_DELAY = 5_000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  // This is ignored so we can keep it in the template for visibility.  Feel
  // free to delete this parameter in your app if you're not using it!
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loadContext: AppLoadContext,
) {
  return isbot(request.headers.get('user-agent') || '')
    ? handleBotRequest(
        request,
        responseStatusCode,
        responseHeaders,
        reactRouterContext,
      )
    : handleBrowserRequest(
        request,
        responseStatusCode,
        responseHeaders,
        reactRouterContext,
      );
}

function handleBotRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={reactRouterContext} url={request.url} />,
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set('Content-Type', 'text/html');

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            console.error(error);
          }
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={reactRouterContext} url={request.url} />,
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set('Content-Type', 'text/html');

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            console.error(error);
          }
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

async function deleteOldEventsFromDatabase() {
  try {
    console.log('[DB] delete old events');
    return await db
      .delete(event)
      .where(
        and(
          isNotNull(event.end_date),
          or(
            and(lt(event.end_date, new Date()), eq(event.is_long_time, true)),
            and(
              lt(
                event.end_date,
                new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
              ),
              eq(event.is_long_time, false),
            ),
          ),
          eq(event.loop, false),
        ),
      )
      .returning({
        id: event.id,
      });
  } catch (error) {
    console.error('[DB] Failed to delete old events:', error);
    return [];
  }
}

async function getNextDate(date: Date, type: string) {
  const currentTime = date.getTime();
  const currentDate = date.getDate();
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();
  switch (type) {
    case 'daily':
      return new Date(currentTime + 24 * 60 * 60 * 1000);
    case 'weekly':
      return new Date(currentTime + 7 * 24 * 60 * 60 * 1000);
    case 'monthly':
      return new Date(currentYear, currentMonth + 1, currentDate);
    case 'yearly':
      return new Date(currentYear + 1, currentMonth, currentDate);
  }
}

async function updateRepeatEvents() {
  try {
    console.log('[DB] update repeat events');

    const events = await db
      .select()
      .from(event)
      .where(
        and(
          eq(event.loop, true),
          isNotNull(event.end_date),
          lt(event.end_date, new Date(new Date().getTime())),
        ),
      );
    await Promise.all(
      events.map(async (eventData) => {
        const Duration = eventData.loop_duration;
        const nextStartDate = await getNextDate(
          eventData.start_date!,
          Duration!,
        );
        const nextEndDate = await getNextDate(eventData.end_date!, Duration!);
        await db
          .update(event)
          .set({
            start_date: nextStartDate,
            end_date: nextEndDate,
          })
          .where(eq(event.id, eventData.id));
      }),
    );
  } catch (error) {
    console.error('[DB] Failed to update repeat events:', error);
  }
}

async function renewUserChatCounts() {
  let last = new Date().getTime();
  return (async () => {
    try {
      if (new Date().getTime() - last < 60 * 60 * 1000) {
        return;
      }
      last = new Date().getTime();
      console.log('[DB] renew user chat counts');
      await db
        .update(chatSession)
        .set({
          count: 5,
        })
        .where(eq(chatSession.count, 0));
    } catch (error) {
      console.error('[DB] Failed to renew user chat counts:', error);
    }
  })();
}

setInterval(
  () => {
    deleteOldEventsFromDatabase();
    updateRepeatEvents();
    renewUserChatCounts();
  },
  60 * 60 * 1000,
);
deleteOldEventsFromDatabase();
updateRepeatEvents();
renewUserChatCounts();
