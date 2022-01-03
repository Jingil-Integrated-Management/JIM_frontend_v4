export interface Outsource {
  id?: number;
  material_price?: string | null;
  milling_price?: string | null;
  heat_treat_price?: string | null;
  wire_price?: string | null;
  material_client?: number | null;
  milling_client?: number | null;
  heat_treat_client?: number | null;
  wire_client?: number | null;
  material_client__name?: string | null;
  milling_client__name?: string | null;
  heat_treat_client__name?: string | null;
  wire_client__name?: string | null;
}
