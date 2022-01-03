import formatDate from './formatDate';
import { TableData } from '../types';

const generateURL = (data: TableData) => {
  let baseURL = data.category === 'part' ? 'part/' : 'drawing/';
  baseURL += `?client=${data.client}`;

  if (data.page) baseURL += `&page=${data.page}`;
  if (data.month !== undefined) {
    let lastDate = new Date(
      Number(data.month.split('-')[0]),
      Number(data.month.split('-')[1]) % 12,
      0
    ).getDate();
    baseURL += `&created_at__gte=${data.month}-01`;
    baseURL += `&created_at__lte=${data.month}-${lastDate}`;
  }
  if (data.type === 'dashboard') baseURL += '&is_closed=false';
  else if (data.type === 'client') baseURL += '&is_closed=true';

  if (data.main_division && data.main_division.length !== 0)
    baseURL += `&main_division=${data.main_division}`;
  if (data.sub_division && data.sub_division?.length !== 0)
    baseURL += `&sub_division=${data.sub_division}`;

  if (data.startDate && data.endDate)
    baseURL += `&created_at__gte=${formatDate(
      data.startDate
    )}&created_at__lte=${formatDate(data.endDate)}`;

  if (data.is_outsource === true) baseURL += '&is_outsource=true';
  else if (data.is_outsource === false) baseURL += '&is_outsource=false';

  return baseURL;
};

export default generateURL;
