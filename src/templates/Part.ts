import { PartData } from '../types';

const Part = (): PartData => ({
  x: '',
  y: '',
  z: '',
  quantity: 0,
  price: null,
  drawing: -1,
  division: -1,
  material: 'SKS3',
  outsource: null,
  file: null,
});

export default Part;
