
import React from 'react';
import { AppTab, Currency } from '../types';

interface HeaderProps {
  activeTab: AppTab;
  currency: Currency;
}

const Header: React.FC<HeaderProps> = ({ activeTab, currency }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center space-x-2">
        <span className="text-slate-500 font-medium">Picasso</span>
        <span className="text-slate-300">/</span>
        <span className="text-slate-900 font-bold">{activeTab}</span>
      </div>

      <div className="flex items-center space-x-4 md:space-x-6">
        <div className="hidden lg:flex items-center space-x-2 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-100">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-semibold uppercase tracking-wider">Agents Live</span>
        </div>
        
        {/* Currency Indicator */}
        <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">
            {currency.symbol} {currency.code}
          </span>
        </div>

        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 h-2 w-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center space-x-3 border-l border-slate-200 pl-4 md:pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900">Account Profile</p>
            <p className="text-xs text-slate-500">Security Verified</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center border border-slate-200 text-indigo-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
