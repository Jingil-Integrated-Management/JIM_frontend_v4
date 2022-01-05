import { DrawingData } from '../types';
import formatDate from '../utils/formatDate';

const Drawing = (): DrawingData => ({
  name: '',
  client: -1,
  created_at: formatDate(new Date()),
  comment: '',
  is_outsource: false,
});

export default Drawing;
