export const fromattedDate = (date: string): string => {
  const newDate = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };
  return newDate.toLocaleDateString('id-ID', options);
};

export default fromattedDate;
