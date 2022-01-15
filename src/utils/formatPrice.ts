const formatPrice = (value: string | number | null | undefined) => {
  if (typeof value === 'number') value = value.toString();
  else if (value === null || value === undefined) return '0';
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export default formatPrice;
