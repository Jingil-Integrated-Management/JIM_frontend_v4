export interface Drawing {
  id?: number;
  name: string;
  created_at: string;
  comment?: string | null;
  is_outsource: boolean;
  client: number;
  client__name?: string;
  price?: string | null;
  part_count?: number;
  is_closed?: boolean;
}
