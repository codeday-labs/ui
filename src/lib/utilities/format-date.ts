import { formatDistanceToNow, parseJSON } from 'date-fns';
import * as dateTz from 'date-fns-tz'; // `build` script fails on importing some of named CommonJS modules

import type { Timestamp } from '$types';

type ValidTime = Parameters<typeof parseJSON>[0] | Timestamp;

const pattern = 'yyyy-MM-dd z HH:mm:ss.SS';

export function formatDate(
  date?: ValidTime | null,
  timeFormat: TimeFormat = 'UTC',
): string {
  if (!date || date === undefined || date === null) return '';

  try {
    if (isTimestamp(date)) {
      date = timestampToDate(date);
    }

    const parsed = parseJSON(date);

    if (timeFormat === 'local') return dateTz.format(parsed, pattern);
    if (timeFormat === 'relative') return formatDistanceToNow(parsed) + ' ago';

    return dateTz.formatInTimeZone(parsed, 'UTC', pattern);
  } catch {
    return '';
  }
}

function timestampToDate(ts: Timestamp): Date {
  if (!isTimestamp(ts)) {
    throw new TypeError('provided value is not a timestamp');
  }

  const d = new Date(0);

  // We check for the existence of nanos in the type guard so non null is fine here
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  d.setTime(Number(ts.seconds) * 1000 + ts.nanos! ?? 0 / 1000);

  return d;
}

function isTimestamp(arg: unknown): arg is Timestamp {
  // This any is required here to allow us to introspect the object without errors
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const typedArg = arg as any;
  if (typeof arg === 'object') {
    return typedArg['seconds'] !== undefined && typedArg['nanos'] !== undefined;
  }
  return false;
}
