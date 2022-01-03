export default interface TableData {
  type: string;
  category: string;
  client: number;
  page?: number;
  month?: string;
  is_outsource?: boolean;
  main_division?: string;
  sub_division?: string;
  startDate?: Date | null;
  endDate?: Date | null;
}
