
import React, { useState } from 'react';
import { CATEGORIES } from '../constants';
import { getCardRecommendation } from '../geminiService';
import { Recommendation, Currency } from '../types';

interface RecommendationWidgetProps {
  currency: Currency;
}

const RecommendationWidget: React.FC<RecommendationWidgetProps> = ({ currency }) => {
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState<number>(100);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  const handleRecommend = async () => {
    if (!merchant) return;
    setLoading(true);
    try {
      const result = await getCardRecommendation(merchant, category, amount);
      setRecommendation(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">Decision Brain</h2>
        <p className="text-slate-500 mt-2">Real-time credit card optimization at the moment of purchase ({currency.code}).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Input Form */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-800">New Purchase Request</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Merchant Name</label>
              <input 
                type="text" 
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                placeholder="e.g. Amazon, Starbucks..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Amount ({currency.symbol})</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{currency.symbol}</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <button
              onClick={handleRecommend}
              disabled={loading || !merchant}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
                loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Rules...
                </span>
              ) : 'Get Recommendation'}
            </button>
          </div>
        </div>

        {/* Recommendation Output */}
        <div className="h-full">
          {recommendation ? (
            <div className="bg-indigo-50 p-8 rounded-2xl border-2 border-indigo-200 h-full flex flex-col justify-center animate-in zoom-in duration-300">
              <div className="flex items-center justify-between mb-6">
                <span className="bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Top Pick</span>
                <span className="text-indigo-600 font-bold text-xl">+{currency.symbol}{recommendation.cashbackAmount.toFixed(2)}</span>
              </div>
              
              <h4 className="text-3xl font-black text-slate-900 mb-4">{recommendation.cardName}</h4>
              
              <div className="p-4 bg-white rounded-xl shadow-sm border border-indigo-100 mb-6">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Why this card?</h5>
                <p className="text-slate-700 leading-relaxed text-sm italic font-medium">
                  "{recommendation.reasoning}"
                </p>
              </div>

              <div className="flex items-center space-x-2 text-indigo-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 21a9.003 9.003 0 008.367-5.657l-2.51-1.204A13.937 13.937 0 0112 18c-2.323 0-4.532-.566-6.476-1.574l-2.51 1.204A9.003 9.003 0 0012 21z" />
                </svg>
                <span className="text-xs font-bold">XAI Verified Explanation</span>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full text-slate-400">
              <svg className="h-16 w-16 mb-4 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0012 18.75c-1.03 0-1.9-.4-2.59-1.177L8.863 17z" />
              </svg>
              <p className="font-medium">Enter transaction details to see the optimal card choice</p>
              <p className="text-xs mt-1">Our multi-agent architecture will simulate the rules engine in real-time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationWidget;
