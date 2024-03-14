import dates from "../src/utils/dates.js";

export function getCurrentWeek() {
  const currentDate = new Date();
  const pastSevenDays = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(currentDate);
    day.setDate(currentDate.getDate() - i);
    pastSevenDays.push(dates(day));
  }
  return pastSevenDays;
}

export function getLastWeek() {
  const currentDate = new Date();
  const startOfCurrentWeek = new Date(currentDate);
  startOfCurrentWeek.setDate(currentDate.getDate() - currentDate.getDay());

  const startOfLastWeek = new Date(startOfCurrentWeek);
  startOfLastWeek.setDate(startOfCurrentWeek.getDate() - 13);

  const lastWeekDates = [];

  for (let i = 6; i >= 0; i--) {
    const day = new Date(startOfLastWeek);
    day.setDate(startOfLastWeek.getDate() + i);
    lastWeekDates.push(dates(day));
  }

  return lastWeekDates;
}
