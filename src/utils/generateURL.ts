import formatDate from './formatDate';
import { TableData } from '../types';

const getLastDate = (month: string) => {
  return new Date(
    Number(month.split('-')[0]),
    Number(month.split('-')[1]) % 12,
    0
  ).getDate();
};

const generateURL = (data: TableData) => {
  let baseURL = '';

  baseURL += data.category === 'part' ? 'part/' : 'drawing/';
  baseURL += `?client=${data.client}`;
  baseURL += `&is_closed=${data.type !== 'dashboard'}`;
  baseURL += `&page=${data.page}`;

  if (data.month) {
    baseURL += `&created_at__gte=${data.month}-01`;
    baseURL += `&created_at__lte=${data.month}-${getLastDate(data.month)}`;
  }

  if (data.main_division) baseURL += `&main_division=${data.main_division}`;
  if (data.sub_division) baseURL += `&sub_division=${data.sub_division}`;

  if (data.startDate && data.endDate) {
    baseURL += `&created_at__gte=${formatDate(data.startDate)}`;
    baseURL += `&created_at__lte=${formatDate(data.endDate)}`;
  }

  if (data.type === 'statistics_os') baseURL += '&is_outsource=true';
  else if (data.type === 'statistics_pol') baseURL += '&is_outsource=false';
  else if (data.is_outsource) baseURL += `&is_outsource=${data.is_outsource}`;

  if (data.category === 'drawing' && data.drawingName)
    baseURL += `&name=${data.drawingName}`;

  return baseURL;
};

export default generateURL;
