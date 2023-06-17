export const calculateDates = function (
  days,
  firstDate,
  lastDate,
  lessonsCount,
) {
  const generatedDates = [];

  days.forEach((day) => {
    let startDate = new Date(firstDate);

    if (lessonsCount) {
      generateDatesWithLessonsCount(
        day,
        startDate,
        lessonsCount,
        generatedDates,
      );
    } else if (lastDate) {
      generateDatesWithLastDate(day, startDate, lastDate, generatedDates);
    }
  });

  return generatedDates;
};

function generateDatesWithLessonsCount(
  day,
  startDate,
  lessonsCount,
  generatedDates,
) {
  for (let i = 0; i < lessonsCount; i++) {
    startDate.setDate(
      startDate.getDate() + ((day - 1 - startDate.getDay() + 7) % 7) + 1,
    );
    generatedDates.push(startDate.toUTCString());
  }
}

const generateDatesWithLastDate = function (
  day,
  startDate,
  lastDate,
  generatedDates,
) {
  const endDate = new Date(lastDate);
  while (endDate > startDate && generatedDates.length < 300) {
    startDate.setDate(
      startDate.getDate() + ((day - 1 - startDate.getDay() + 7) % 7) + 1,
    );
    if (startDate <= endDate) {
      generatedDates.push(startDate.toUTCString());
    }
  }
};
