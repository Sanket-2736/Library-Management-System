export interface DashboardStats {
  totalBooks: number;
  availableBooks: number;
  totalUsers: number;
  activeLoans: number;
  overdueLoans: number;
  activeSubscriptions: number;
  totalRevenue: number;
  totalGenres: number;
}

export interface MonthlyBorrowingData {
  month: string;
  borrowed: number;
  returned: number;
}

export interface SubscriptionStatsData {
  planName: string;
  count: number;
  percentage: number;
}

export interface PaymentStatsData {
  month: string;
  amount: number;
  transactions: number;
}

export interface ChartDataSet {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  fill?: boolean;
}
