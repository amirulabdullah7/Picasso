
import React, { useState, useMemo } from 'react';
import { Transaction, Card, Currency } from '../types';
import { MOCK_CARDS } from '../constants';

interface LedgerProps {
  transactions: Transaction[];
  onReset: () => void;
  currency: Currency;
}

const Ledger: React.FC<LedgerProps> = ({ transactions, onReset, currency }) => {
  const [cardFilter, setCardFilter] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'latest' | 'amount'>('latest');

  const filteredAndSorted = useMemo(() => {
    let result = [...transactions];
    
    // Filtering
    if (cardFilter !== 'All') {
      result = result.filter(t => t.cardUsed.toLowerCase().includes(cardFilter.toLowerCase()));
    }

    // Sorting
    result.sort((a, b) => {
      if (sortOrder === 'latest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return b.amount - a.amount;
      }
    });

    return result;
  }, [transactions, cardFilter, sortOrder]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Transaction Ledger</h2>
          <p className="text-slate-500 text-sm">Unified view of all rewards data in {currency.name} ({currency.code}).</p>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={onReset}
            className="px-4 py-2 bg-rose-50 text-rose-600 text-xs font-bold rounded-lg border border-rose-100 hover:bg-rose-100 transition-colors"
          >
            Reset All Data
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filters Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Filter Card</label>
              <select 
                value={cardFilter}
                onChange={(e) => setCardFilter(e.target.value)}
                className="text-xs font-bold border-slate-200 rounded-lg p-1.5 focus:ring-indigo-500 bg-white"
              >
                <option value="All">All Portfolio</option>
                {MOCK_CARDS.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Sort By</label>
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="text-xs font-bold border-slate-200 rounded-lg p-1.5 focus:ring-indigo-500 bg-white"
              >
                <option value="latest">Latest First</option>
                <option value="amount">Highest Amount</option>
              </select>
            </div>
          </div>
          <p className="text-[10px] font-bold text-slate-400">
            SHOWING {filteredAndSorted.length} ENTRIES
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100">
                <th className="px-6 py-4">Transaction Details</th>
                <th className="px-6 py-4">Card Used</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-right">Rewards ({currency.symbol})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAndSorted.length > 0 ? (
                filteredAndSorted.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{tx.merchant}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase">{tx.date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold border border-indigo-100">
                        {tx.cardUsed}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 font-medium">{tx.category}</td>
                    <td className="px-6 py-4 text-sm font-black text-slate-900 text-right">
                      {currency.symbol}{tx.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-black text-emerald-600">+{currency.symbol}{tx.cashbackEarned.toFixed(2)}</p>
                      <p className="text-[10px] text-slate-400">Reward Captured</p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-400 italic text-sm">
                    No transactions found for the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Ledger;
