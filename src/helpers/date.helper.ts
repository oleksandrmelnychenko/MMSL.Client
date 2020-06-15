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
