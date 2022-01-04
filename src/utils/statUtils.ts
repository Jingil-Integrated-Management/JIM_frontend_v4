const getGross = (
  n1: number | string | null | undefined,
  n2: number | string | null | undefined
) => {
  if (n1 === null || n2 === null || n1 === undefined || n2 === undefined)
    return '0';
  if (typeof n1 === 'string') n1 = Number(n1);
  if (typeof n2 === 'string') n2 = Number(n2);

  return String(Math.round((n1 / n2) * 100));
};

export default getGross;
