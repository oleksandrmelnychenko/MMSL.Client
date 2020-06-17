export const dateToString = (date: Date | null | undefined): string => {
  if (date) {
    let dateResult = new Date(date);
    dateResult.setTime(
      dateResult.getTime() - dateResult.getTimezoneOffset() * 60000
    );

    return dateResult.toJSON();
  } else {
    return '';
  }
};

export const parseDateToString = (date: Date | null | undefined) => {
  let result = '';

  if (date) {
    result = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  return result;
};
