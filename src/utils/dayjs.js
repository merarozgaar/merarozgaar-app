// @flow
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.extend(relativeTime);

export const timeFromNow = (date: string): string =>
  dayjs(date).add(5, 'hours').add(30, 'minutes').fromNow(false);
