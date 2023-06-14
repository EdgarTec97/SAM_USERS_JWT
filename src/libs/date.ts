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
