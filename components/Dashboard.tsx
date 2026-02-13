
import React, { useMemo } from 'react';
import { CATEGORIES } from '../constants';
import { Transaction, Currency } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  transactions: Transaction[];
  currency: Currency;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, currency }) => {
  const stats = useMemo(() => {
    const totalEarned = transactions.reduce((acc, tx) => acc + tx.cashbackEarned, 0);
    const totalPotential = transactions.reduce((acc, tx) => acc + tx.potentialCashback, 0);
    const score = totalPotential > 0 ? (totalEarned / totalPotential) * 100 : 0;
    
    return [
      { name: 'Total Rewards Earned', value: `${currency.symbol}${totalEarned.toFixed(2)}`, trend: '0%', color: 'text-indigo-600', bg: 'bg-indigo-50' },
      { name: 'Missed Rewards (Leakage)', value: `${currency.symbol}${(totalPotential - totalEarned).toFixed(2)}`, trend: '0%', color: 'text-rose-600', bg: 'bg-rose-50' },
      { name: 'Optimization Score', value: `${score.toFixed(0)}%`, trend: '0%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { name: 'Tracked Spending', value: `${currency.symbol}${transactions.reduce((acc, tx) => acc + tx.amount, 0).toLocaleString()}`, trend: '0%', color: 'text-amber-600', bg: 'bg-amber-50' }
    ];
  }, [transactions, currency]);

  const chartData = useMemo(() => {
    return CATEGORIES.map(cat => ({
      category: cat,
      amount: transactions.filter(t => t.category === cat).reduce((acc, t) => acc + t.cashbackEarned, 0),
      color: '#4f46e5'
    })).filter(d => d.amount > 0);
  }, [transactions]);

  const hasTransactions = transactions.length > 0;

  return (
    <div className="space-y-8 pb-12">
      <div className="relative overflow-hidden rounded-2xl bg-indigo-900 p-8 text-white">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight">Welcome to Picasso!</h2>
          <p className="mt-2 text-indigo-100 opacity-90">
            {hasTransactions 
              ? `You have ${transactions.length} transactions recorded in your ${currency.code} portfolio.`
              : `Your portfolio is empty. Upload a receipt or statement using "Document OCR" to start tracking rewards.`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <p className="text-sm font-medium text-slate-500 mb-1">{stat.name}</p>
            <div className="flex items-end justify-between">
              <h3 className={`text-2xl font-bold ${stat.color}`}>{stat.value}</h3>
              {hasTransactions && <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.bg} ${stat.color}`}>{stat.trend}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 min-h-[400px]">
          <h3 className="font-bold text-slate-800 mb-4">Latest Portfolio Activity</h3>
          {hasTransactions ? (
            <div className="space-y-4">
              {transactions.slice(0, 5).map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                      {tx.merchant[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{tx.merchant}</p>
                      <p className="text-xs text-slate-500">{tx.date} • {tx.cardUsed}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{currency.symbol}{tx.amount.toFixed(2)}</p>
                    <p className="text-xs font-bold text-emerald-600">+{currency.symbol}{tx.cashbackEarned.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-slate-400 font-medium">No activity yet</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 min-h-[400px]">
          <h3 className="font-bold text-slate-800 mb-6">Cashback ({currency.symbol}) Distribution</h3>
          {hasTransactions && chartData.length > 0 ? (
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="category" hide />
                  <YAxis hide />
                  <Tooltip 
                    formatter={(value: number) => [`${currency.symbol}${value.toFixed(2)}`, 'Cashback']}
                  />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]} fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-slate-500 mt-4 text-center">Reward capture breakdown across categories.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
              <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <p className="text-slate-400 font-medium">Chart will appear once rewards are tracked</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
