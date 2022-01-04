const getGross = (
  n1: string | null | undefined,
  n2: string | null | undefined
) => {
  if (!n1 || !n2 || n1 === '0' || n2 === '0') return '0';

  return String(Math.round((Number(n1) / Number(n2)) * 100));
};

export default getGross;
