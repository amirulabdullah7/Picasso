
import { Card, Transaction, Currency } from './types';

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' }
];

export const MOCK_CARDS: Card[] = [
  {
    id: 'm2gold',
    name: 'Maybank 2 Gold/Platinum',
    bank: 'Maybank',
    // Base: 1x TreatsPoints (approx 0.1% or effectively low cashback)
    cashbackRates: { 'Dining': 0.00, 'Grocery': 0.00, 'Other': 0.00, 'Petrol': 0.00, 'Online': 0.00 },
    // Rule: 5% Cashback on everything on weekends (Amex)
    weekendRates: { 'Dining': 0.05, 'Grocery': 0.05, 'Petrol': 0.05, 'Online': 0.05, 'Travel': 0.05, 'Other': 0.05 },
    color: 'bg-amber-500'
  },
  {
    id: 'mikhwan',
    name: 'Maybank Ikhwan Visa Infinite',
    bank: 'Maybank',
    cashbackRates: { 'Petrol': 0.01, 'Grocery': 0.01, 'Other': 0.01 },
    // Rule: 5% Cashback on Petrol and Groceries (Friday & Saturday)
    specificDayRates: {
      5: { 'Petrol': 0.05, 'Grocery': 0.05 }, // Friday
      6: { 'Petrol': 0.05, 'Grocery': 0.05 }  // Saturday
    },
    color: 'bg-slate-800'
  },
  {
    id: 'pbquantum',
    name: 'Public Bank Quantum',
    bank: 'Public Bank',
    // Rule: 5% Cashback on Online & Dining (min spend applies, but flat in our model)
    cashbackRates: { 'Online': 0.05, 'Dining': 0.05, 'Other': 0.00 },
    color: 'bg-red-700'
  },
  {
    id: 'pbvs',
    name: 'Public Bank Visa Signature',
    bank: 'Public Bank',
    cashbackRates: { 'Grocery': 0.06, 'Dining': 0.06, 'Online': 0.06, 'Other': 0.03 },
    color: 'bg-slate-900'
  },
  {
    id: 'uobone',
    name: 'UOB One Card',
    bank: 'UOB Malaysia',
    // Rule: Tiered up to 10% for Petrol, Groceries, Dining
    cashbackRates: { 'Grocery': 0.10, 'Dining': 0.10, 'Petrol': 0.10, 'Utilities': 0.10, 'Other': 0.002 },
    color: 'bg-blue-900'
  },
  {
    id: 'uobzenith',
    name: 'UOB Zenith Card',
    bank: 'UOB Malaysia',
    cashbackRates: { 'Travel': 0.06, 'Dining': 0.04, 'Other': 0.01 },
    color: 'bg-indigo-950'
  },
  {
    id: 'hsbcmpower',
    name: 'HSBC Amanah MPower',
    bank: 'HSBC Malaysia',
    // Rule: 8% on Groceries & Petrol with min spend
    cashbackRates: { 'Grocery': 0.08, 'Petrol': 0.08, 'Other': 0.01 },
    color: 'bg-rose-600'
  },
  {
    id: 'hsbctravel',
    name: 'HSBC TravelOne',
    bank: 'HSBC Malaysia',
    cashbackRates: { 'Travel': 0.08, 'Other': 0.01 },
    color: 'bg-slate-800'
  },
  {
    id: 'cimbcash',
    name: 'CIMB Cash Order',
    bank: 'CIMB Bank',
    cashbackRates: { 'Dining': 0.10, 'Petrol': 0.10, 'Grocery': 0.10, 'Other': 0.01 },
    color: 'bg-red-600'
  },
  {
    id: 'cimbtravel',
    name: 'CIMB Travel Platinum',
    bank: 'CIMB Bank',
    cashbackRates: { 'Travel': 0.05, 'Other': 0.01 },
    color: 'bg-slate-700'
  },
  {
    id: 'scsimply',
    name: 'SCB Simply Cash',
    bank: 'Standard Chartered',
    cashbackRates: { 'Dining': 0.15, 'Grocery': 0.15, 'Petrol': 0.15, 'Other': 0.01 },
    color: 'bg-emerald-600'
  },
  {
    id: 'scjourney',
    name: 'SCB Journey Card',
    bank: 'Standard Chartered',
    cashbackRates: { 'Dining': 0.05, 'Travel': 0.05, 'Other': 0.01 },
    color: 'bg-indigo-900'
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [];

export const CATEGORIES = ['Grocery', 'Insurance', 'Dining', 'Travel', 'Utilities', 'Other', 'Petrol', 'Online'];

export const MALAYSIAN_BANKS_CC_DATA = [
  {
    bank: 'Maybank',
    cards: [
      {
        name: 'Maybank 2 Gold/Platinum Cards',
        features: '5% Cashback on weekends (Amex). No annual fee for life.',
        bestFor: 'Weekends, Dining, General Spending'
      },
      {
        name: 'Maybank Islamic Ikhwan Visa Infinite',
        features: '5% Cashback on Petrol and Groceries (Fri & Sat). 10,000 TreatsPoints on first spend.',
        bestFor: 'Groceries, Petrol, Islamic Banking'
      }
    ]
  },
  {
    bank: 'Public Bank',
    cards: [
      {
        name: 'Public Bank Quantum Visa/Mastercard',
        features: '5% Cashback on Online & Dining (Mastercard). Low min spend.',
        bestFor: 'Online Shopping, Dining'
      },
      {
        name: 'Public Bank Visa Signature',
        features: '6% Cashback on Groceries, Dining, and Online transactions.',
        bestFor: 'High Cashback, Essentials'
      }
    ]
  },
  {
    bank: 'UOB Malaysia',
    cards: [
      {
        name: 'UOB One Card',
        features: 'Up to 10% Cashback on Petrol, Groceries, Dining, and Grab.',
        bestFor: 'Daily Essentials, Grab Users'
      },
      {
        name: 'UOB Zenith Card',
        features: 'Premium travel benefits, airport lounge access.',
        bestFor: 'Travel, Premium Lifestyle'
      }
    ]
  },
  {
    bank: 'HSBC Malaysia',
    cards: [
      {
        name: 'HSBC Amanah MPower Visa Platinum-i',
        features: '8% Cashback on Groceries and Petrol.',
        bestFor: 'Groceries, Petrol'
      }
    ]
  },
  {
    bank: 'CIMB Bank',
    cards: [
      {
        name: 'CIMB Cash Order Card',
        features: 'Up to 10% Cashback on Dining, Petrol, and Groceries.',
        bestFor: 'Cashback Lovers'
      }
    ]
  },
  {
    bank: 'Standard Chartered',
    cards: [
      {
        name: 'SCB Simply Cash Card',
        features: 'Flat 15% cashback on Dining, Groceries, and Petrol for promotional period.',
        bestFor: 'Simplicity, New Sign-ups'
      }
    ]
  }
];
