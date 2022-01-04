import { PartData } from '../types';

export const Part = (): PartData => ({
  x: '',
  y: '',
  z: '',
  quantity: -1,
  price: '',
  comment: '',
  drawing: -1,
  division: -1,
  material: '',
  outsource: -1,
  file: null,
});
