
export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export interface Card {
  id: string;
  name: string;
  bank: string;
  cashbackRates: Record<string, number>; // Base rates (usually weekdays)
  weekendRates?: Record<string, number>; // Rates for Saturday (6) and Sunday (0)
  specificDayRates?: Record<number, Record<string, number>>; // Specific day index (0-6) -> Category Rates
  color: string;
}

export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  category: string;
  amount: number;
  cardUsed: string;
  cashbackEarned: number;
  potentialCashback: number;
  isOptimized: boolean;
  notes?: string;
}

export interface Recommendation {
  cardName: string;
  cashbackAmount: number;
  reasoning: string;
}

export enum AppTab {
  DASHBOARD = 'Dashboard',
  RECOMMENDER = 'Decision Brain',
  SCANNER = 'Document OCR',
  LEDGER = 'Transaction Ledger',
  ANALYTICS = 'Executive View',
  CC_INFO = 'CC Info',
  VOICE_AGENT = 'Voice Concierge'
}
