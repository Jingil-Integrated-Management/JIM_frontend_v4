import { DrawingData } from '../types';
import formatDate from '../utils/formatDate';

export const Drawing = (): DrawingData => ({
  name: '',
  client: -1,
  created_at: formatDate(new Date()),
  comment: '',
  is_outsource: false,
});
