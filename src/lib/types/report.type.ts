// report.types.ts

// Date range type for reports
export interface DateRange {
  from: any;
  to: any;
  start: any;
  end: any;
  startDate: Date;
  endDate: Date;
}

// Generic report props with date range
export interface ReportProps {
  dateRange: DateRange;
}

// Inventory Report Types
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  location?: string;
}

export interface InventoryReportData {
  items: InventoryItem[];
  totalItems: number;
  totalQuantity: number;
}

// Lead Conversion Report Types
export interface LeadConversionData {
  source: string;
  leads: number;
  conversions: number;
  conversionRate: number; // expressed as percentage
}

// Sales Report Types
export interface SalesRecord {
  id: string;
  date: string; // ISO string
  product: string;
  quantity: number;
  price: number; // per unit
}

export interface SalesReportData {
  records: SalesRecord[];
  totalSales: number;
  totalRevenue: number;
}
