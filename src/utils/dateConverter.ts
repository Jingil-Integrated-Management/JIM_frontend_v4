const dateConverter = (formatedDate: String): Date => {
  const year = Number(formatedDate.split('-')[0]);
  const month = Number(formatedDate.split('-')[1]) - 1;
  const day = Number(formatedDate.split('-')[2]);

  return new Date(year, month, day);
};

export default dateConverter;
