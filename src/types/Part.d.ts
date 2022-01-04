export default interface Part {
  id?: number;
  x: string;
  y: string;
  z: string;
  quantity: number;
  price: string | null;
  comment?: string | null;
  drawing: number;
  created_at?: string;
  division: number;
  material: string;
  outsource?: number | null;
  file?: number | null;
  client__name?: string;
  client__id?: number;
  file_name?: string | null;
  division__main_division?: string;
  division__sub_division?: string;
  drawing__name?: string;
  drawing__is_outsource?: boolean;
  outsource_info?: [] | null;
  fileSrc?: string;
}
