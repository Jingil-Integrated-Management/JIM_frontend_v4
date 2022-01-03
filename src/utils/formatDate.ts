const formatDate = (date: Date) => {
  let result: string[] = [];
  date
    .toLocaleDateString()
    .split('.')
    .forEach((value) => {
      if (value !== '') result.push(value.trim());
    });
  return result.join('-');
};

export default formatDate;
