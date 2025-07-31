export interface ISaleTrendsDTO {
  startDate?: string;
  endDate?: string;
  clientId?: number | undefined;
}

export interface SaleTrendsData {
  average_daily_count: number;
  daily_counts: DailyCounts;
  max_daily_count: number;
  min_daily_count: number;
  total_count: number;
}

export interface DailyCounts {
  [key: string]: number;
}
