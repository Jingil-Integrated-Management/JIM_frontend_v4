import { PartData } from '../types';

const Part = (): PartData => ({
  x: '',
  y: '',
  z: '',
  quantity: -1,
  price: null,
  drawing: -1,
  division: -1,
  material: '',
  outsource: null,
  file: null,
});

export default Part;
