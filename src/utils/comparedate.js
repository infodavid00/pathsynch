/*  */
import dates from "./dates.js";

export function compareDate(day1Str, day2Str) {
  const day1arr = day1Str.split("/");
  const day2arr = day2Str.split("/");

  const day1 = {
    dd: Number(day1arr[0]),
    mm: Number(day1arr[1]),
    yyyy: Number(day1arr[2]),
  };
  const day2 = {
    dd: Number(day2arr[0]),
    mm: Number(day2arr[1]),
    yyyy: Number(day2arr[2]),
  };

  let final;

  if (
    day2.yyyy > day1.yyyy ||
    (day2.yyyy === day1.yyyy && day2.mm > day1.mm) ||
    (day2.yyyy === day1.yyyy && day2.mm === day1.mm && day2.dd >= day1.dd)
  ) {
    final = ["Day 2", 2];
  } else {
    final = ["Day 1", 1];
  }

  return final;
}

export function returnDategap(day1Str, day2Str) {
  const day1arr = day1Str.split("/");
  const day2arr = day2Str.split("/");

  const day1 = {
    dd: Number(day1arr[0]),
    mm: Number(day1arr[1]),
    yyyy: Number(day1arr[2]),
  };
  const day2 = {
    dd: Number(day2arr[0]),
    mm: Number(day2arr[1]),
    yyyy: Number(day2arr[2]),
  };

  const calculateDaysDifference = () => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date(day1.yyyy, day1.mm - 1, day1.dd);
    const secondDate = new Date(day2.yyyy, day2.mm - 1, day2.dd);

    const daysDifference = Math.round(
      Math.abs((firstDate - secondDate) / oneDay)
    );

    return daysDifference;
  };

  const daysDifference = calculateDaysDifference();

  return daysDifference;
}

export function calculateFutureDate(amountOfDays) {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + amountOfDays);

  const dd = String(futureDate.getDate()).padStart(2, "0");
  const mm = String(futureDate.getMonth() + 1).padStart(2, "0"); // January is 0!
  const yyyy = futureDate.getFullYear();

  const futureDateString = `${dd}/${mm}/${yyyy}`;

  return futureDateString;
}

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
