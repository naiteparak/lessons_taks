export const isDateValid = function (dates) {
  const regex = /^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|1[0-9]|2[0-9]|3[0-1])$/;
  const [firstDate, secondDate] = dates;
  return !!(
    !firstDate.trim().match(regex) ||
    (secondDate && !secondDate.trim().match(regex)) ||
    dates.length > 2
  );
};
