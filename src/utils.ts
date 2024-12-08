export function getCurrentDate(): string {
  const today: Date = new Date();
  const year: number = today.getFullYear();
  let month: number | string = today.getMonth() + 1;
  let day: number | string = today.getDate();

  // Ensure month and day are formatted as two digits if less than 10
  month = month < 10 ? `0${month}` : month;
  day = day < 10 ? `0${day}` : day;
  //   console.log(`${day}-${month}-${year}`);
  //   console.log(new Date(`${day}.${month}.${year}`));
  return `${day}.${month}.${year}`;
}
export function getCurrentDateFromDate(date: string): string {
  const today: Date = new Date(date);
  const year: number = today.getFullYear();
  let month: number | string = today.getMonth() + 1;
  let day: number | string = today.getDate();

  // Ensure month and day are formatted as two digits if less than 10
  month = month < 10 ? `0${month}` : month;
  day = day < 10 ? `0${day}` : day;
  console.log(`${day}-${month}-${year}`);
  //   console.log(new Date(`${day}.${month}.${year}`));
  return `${day}.${month}.${year}`;
}
