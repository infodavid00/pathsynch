export default function dates(date) {
  let currentDate = date;

  let year = currentDate.getFullYear().toString().slice(-4);
  let month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  let day = currentDate.getDate().toString().padStart(2, "0");

  let formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
}
