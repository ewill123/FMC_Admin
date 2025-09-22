export interface Asset {
  id: string;
  name: string;
  code?: string;
  department?: string;
  staff_name?: string; // ✅ Added staff_name
  qty?: number;
  condition?: string;
  need_repair?: boolean;
  funding_source?: string;
  purchase_date?: string;
  description?: string;
  image_urls?: string[];
  depreciation?: number; // ✅ Added depreciation
  created_at: string;
}
