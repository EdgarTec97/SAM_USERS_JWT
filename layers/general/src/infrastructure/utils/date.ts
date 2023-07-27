import dayjs, { ManipulateType } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';
import isBetween from 'dayjs/plugin/isBetween';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(utc);
dayjs.extend(tz);
dayjs.extend(isBetween);
dayjs.extend(customParseFormat);

export class DayJS {
  private static instance: DayJS | undefined;

  private constructor() {}

  static getInstance() {
    if (DayJS.instance) return DayJS.instance;

    DayJS.instance = new DayJS();

    return DayJS.instance;
  }

  getData(numberToAsign: number, dateType: ManipulateType): number {
    return dayjs().add(numberToAsign, dateType).unix();
  }
}

export function addDays(date: number, days: number) {
  date += 1000 * 60 * 60 * 24 * days;
  return new Date(date).getTime();
}

export function removeDays(date: number, days: number) {
  date -= 1000 * 60 * 60 * 24 * days;
  return new Date(date).getTime();
}

export function getNextDay() {
  const today = new Date().getUTCDay();
  return today === 6 ? 0 : today + 1;
}

export function getPreviousDay() {
  const today = new Date().getUTCDay();
  return today === 0 ? 6 : today - 1;
}
