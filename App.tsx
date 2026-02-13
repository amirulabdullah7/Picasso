
import React, { useState, useEffect } from 'react';
import { AppTab, Transaction, Currency } from './types';
import { SUPPORTED_CURRENCIES } from './constants';
import Dashboard from './components/Dashboard';
import RecommendationWidget from './components/RecommendationWidget';
import ReceiptScanner from './components/ReceiptScanner';
import Analytics from './components/Analytics';
import Ledger from './components/Ledger';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CCInfo from './components/CCInfo';
import LiveConcierge from './components/LiveConcierge';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currency, setCurrency] = useState<Currency>(SUPPORTED_CURRENCIES[0]);

  useEffect(() => {
    const savedTx = localStorage.getItem('picasso_transactions');
    if (savedTx) {
      setTransactions(JSON.parse(savedTx));
    } else {
      setTransactions([]);
    }

    const savedCurrency = localStorage.getItem('picasso_currency');
    if (savedCurrency) {
      setCurrency(JSON.parse(savedCurrency));
    }
  }, []);

  const handleSaveTransaction = (tx: Transaction, detectedCurrency?: Currency) => {
    const updated = [tx, ...transactions];
    setTransactions(updated);
    localStorage.setItem('picasso_transactions', JSON.stringify(updated));

    if (detectedCurrency) {
      setCurrency(detectedCurrency);
      localStorage.setItem('picasso_currency', JSON.stringify(detectedCurrency));
    }
  };

  const handleResetData = () => {
    if (confirm("Are you sure you want to reset all data? This will clear all recorded transactions.")) {
      setTransactions([]);
      setCurrency(SUPPORTED_CURRENCIES[0]);
      localStorage.removeItem('picasso_transactions');
      localStorage.removeItem('picasso_currency');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.DASHBOARD:
        return <Dashboard transactions={transactions} currency={currency} />;
      case AppTab.RECOMMENDER:
        return <RecommendationWidget currency={currency} />;
      case AppTab.SCANNER:
        return <ReceiptScanner onSave={handleSaveTransaction} currency={currency} />;
      case AppTab.LEDGER:
        return <Ledger transactions={transactions} onReset={handleResetData} currency={currency} />;
      case AppTab.ANALYTICS:
        return <Analytics />;
      case AppTab.CC_INFO:
        return <CCInfo />;
      case AppTab.VOICE_AGENT:
        return <LiveConcierge />;
      default:
        return <Dashboard transactions={transactions} currency={currency} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 flex flex-col">
        <Header activeTab={activeTab} currency={currency} />
        <div className="p-4 md:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
