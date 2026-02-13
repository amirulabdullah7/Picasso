
import React from 'react';
import { AppTab } from '../types';

interface SidebarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  // Navigation tabs (excluding Scanner which is moved to the bottom)
  const tabs = [
    { name: AppTab.DASHBOARD, icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { name: AppTab.RECOMMENDER, icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0012 18.75c-1.03 0-1.9-.4-2.59-1.177L8.863 17z' },
    { name: AppTab.VOICE_AGENT, icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
    { name: AppTab.LEDGER, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: AppTab.CC_INFO, icon: 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2' },
    { name: AppTab.ANALYTICS, icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col border-r border-slate-800">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          PROJECT PICASSO
        </h1>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">Rewards Engine</p>
      </div>
      
      <nav className="flex-1 mt-4 px-3 space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => onTabChange(tab.name as AppTab)}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === tab.name 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
            </svg>
            {tab.name}
          </button>
        ))}
      </nav>

      {/* Primary Action Section at the Bottom */}
      <div className="mt-auto p-4 space-y-4">
        <button 
          onClick={() => onTabChange(AppTab.SCANNER)}
          className={`w-full flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 group ${
            activeTab === AppTab.SCANNER 
              ? 'bg-indigo-600 text-white border-none shadow-xl shadow-indigo-500/30' 
              : 'bg-slate-800 text-indigo-400 border border-slate-700 hover:bg-slate-750'
          }`}
        >
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-2 transition-transform group-hover:scale-110 ${
            activeTab === AppTab.SCANNER ? 'bg-white/20' : 'bg-indigo-500/10'
          }`}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
          </div>
          <p className="text-xs font-black uppercase tracking-widest">Document OCR</p>
          <p className={`text-[10px] mt-1 opacity-60 font-medium ${activeTab === AppTab.SCANNER ? 'text-white' : 'text-slate-400'}`}>
            Scan Receipt/PDF
          </p>
        </button>

        <div className="p-4 bg-slate-800/50 rounded-xl">
          <div className="flex items-center space-y-2 flex-col text-center">
            <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
               <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-[10px] font-medium text-slate-300">Optimization Level</p>
            <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-[84%]"></div>
            </div>
            <p className="text-[9px] text-slate-500">84% captured</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
