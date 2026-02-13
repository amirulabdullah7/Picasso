
import React from 'react';
import { MALAYSIAN_BANKS_CC_DATA } from '../constants';

const CCInfo: React.FC = () => {
  // Helper to generate a deterministic gradient based on card name
  const getCardGradient = (name: string) => {
    if (name.toLowerCase().includes('infinite') || name.toLowerCase().includes('zenith') || name.toLowerCase().includes('platinum')) {
      return 'bg-gradient-to-br from-slate-800 via-slate-900 to-black text-white';
    }
    if (name.toLowerCase().includes('gold')) {
      return 'bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-white';
    }
    if (name.toLowerCase().includes('visa')) {
      return 'bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 text-white';
    }
    return 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white';
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>Market Intelligence</span>
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Bank Portfolio Index</h2>
          <p className="text-slate-500 mt-4 text-xl font-medium leading-relaxed">
            Visual breakdown of the Malaysian credit landscape. We've mapped the top-tier rewards structures for major financial institutions.
          </p>
        </div>
        <div className="hidden lg:block">
          <div className="flex -space-x-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 w-12 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="analyst" />
              </div>
            ))}
            <div className="h-12 w-12 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
              +12
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 text-right">Analyst Verified</p>
        </div>
      </div>

      <div className="space-y-16">
        {MALAYSIAN_BANKS_CC_DATA.map((bankData) => (
          <section key={bankData.bank} className="relative">
            <div className="flex items-center space-x-4 mb-8">
              <div className="h-px flex-1 bg-slate-200"></div>
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] bg-slate-50 px-4">
                {bankData.bank}
              </h3>
              <div className="h-px flex-1 bg-slate-200"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {bankData.cards.map((card, idx) => (
                <div key={idx} className="group relative bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Visual Card Mockup */}
                    <div className="flex-shrink-0 w-full lg:w-72">
                      <div className={`aspect-[1.58/1] rounded-2xl p-6 relative overflow-hidden shadow-2xl ${getCardGradient(card.name)}`}>
                        {/* Decorative background patterns */}
                        <div className="absolute top-0 right-0 h-32 w-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 h-24 w-24 bg-black/10 rounded-full blur-xl -ml-12 -mb-12"></div>
                        
                        <div className="relative z-10 h-full flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <div className="w-10 h-8 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded-md opacity-80 border border-yellow-100/30"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-70 italic">{bankData.bank}</span>
                          </div>
                          
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Rewards Tier</p>
                            <h4 className="text-sm font-black leading-tight truncate">{card.name}</h4>
                          </div>
                        </div>

                        {/* Wavy NFC-like icon */}
                        <div className="absolute top-1/2 right-6 -translate-y-1/2 opacity-20">
                          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 8c2-2 5-2 7 0s5 2 7 0M5 12c2-2 5-2 7 0s5 2 7 0M5 16c2-2 5-2 7 0s5 2 7 0" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Infographic Content */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                          Primary Value
                        </span>
                        <div className="flex space-x-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-indigo-600"></div>
                          <div className="h-1.5 w-1.5 rounded-full bg-slate-200"></div>
                          <div className="h-1.5 w-1.5 rounded-full bg-slate-200"></div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-black text-slate-900 mb-2">{card.name}</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">
                          {card.features}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-50 grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target User</p>
                          <p className="text-xs font-bold text-indigo-600">{card.bestFor}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Region</p>
                          <p className="text-xs font-bold text-slate-700">Malaysia (MY)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hover indicator */}
                  <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-indigo-600 transition-all duration-700 group-hover:w-full"></div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-4xl font-black tracking-tight mb-6 leading-tight">Can't decide which card fits your lifestyle?</h3>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Our AI decision engine processes thousands of reward permutations in milliseconds. Stop guessing and start optimizing.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20">
                Launch Decision Brain
              </button>
              <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-black text-sm uppercase tracking-widest transition-all">
                Download Full Report
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
            <div className="aspect-square bg-white/5 rounded-3xl flex items-center justify-center p-8 border border-white/10">
              <div className="h-full w-full bg-gradient-to-br from-indigo-500/50 to-purple-500/50 rounded-2xl"></div>
            </div>
            <div className="aspect-square bg-white/5 rounded-3xl flex items-center justify-center p-8 border border-white/10 mt-8">
              <div className="h-full w-full bg-gradient-to-br from-emerald-500/50 to-teal-500/50 rounded-2xl"></div>
            </div>
          </div>
        </div>

        {/* Abstract background graphics */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 h-96 w-96 bg-indigo-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 h-96 w-96 bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>
    </div>
  );
};

export default CCInfo;
