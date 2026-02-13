
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';

const Analytics: React.FC = () => {
  const technicalMetrics = [
    { name: 'Model F1 Score', value: '0.94', status: 'Stable', color: 'text-indigo-600' },
    { name: 'Regression MAE', value: '0.04', status: 'Healthy', color: 'text-emerald-600' },
    { name: 'Decision Latency', value: '1.2s', status: 'Optimal', color: 'text-blue-600' },
    { name: 'Drift Index', value: '0.01', status: 'Low', color: 'text-slate-600' }
  ];

  // Simulated Scatter Plot data for Amount vs Cashback (inspired by page 16)
  const scatterData = Array.from({ length: 50 }).map((_, i) => ({
    amount: Math.floor(Math.random() * 2000),
    cashback: Math.floor(Math.random() * 100),
    category: ['Grocery', 'Insurance', 'Dining'][Math.floor(Math.random() * 3)]
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Executive Insight</h2>
          <p className="text-slate-500">System-level performance and AI model health monitoring.</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Export PDF Report</button>
          <button className="px-4 py-2 bg-indigo-600 rounded-lg text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">Retrain Models</button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {technicalMetrics.map((m) => (
          <div key={m.name} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.name}</span>
              <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold">{m.status}</span>
            </div>
            <p className={`text-2xl font-black ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* DRSK Coverage Chart */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Decision Distribution (Amount vs Cashback)</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" dataKey="amount" name="Amount" unit="$" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis type="number" dataKey="cashback" name="Cashback" unit="$" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <ZAxis type="category" dataKey="category" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Transactions" data={scatterData} fill="#6366f1" fillOpacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-500 mt-4 italic">
            "The non-linear distribution proves the effectiveness of our specialized ensemble models over a monolithic approach."
          </p>
        </div>

        {/* Model Health Checklist */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">AI Ethics & Compliance Monitor</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">Fairness Testing (Malaysian Regions)</p>
                <span className="text-emerald-500 text-xs font-bold">Passed</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-full"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">XAI - Explanation Confidence</p>
                <span className="text-indigo-500 text-xs font-bold">92%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[92%]"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">PDPA Compliance Verification</p>
                <span className="text-emerald-500 text-xs font-bold">Audit Complete</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-full"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">Bias Mitigation Strategy</p>
                <span className="text-amber-500 text-xs font-bold">Active</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-[78%]"></div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 mb-2">Upcoming Maintenance</h4>
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
              <p className="text-xs text-slate-600">Scheduled model retraining: May 24, 02:00 UTC</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
