
import React, { useState, useRef, useEffect } from 'react';
import { scanDocument } from '../geminiService';
import { Transaction, Currency, Card } from '../types';
import { MOCK_CARDS } from '../constants';

interface ReceiptScannerProps {
  onSave: (tx: Transaction, detectedCurrency?: Currency) => void;
  currency: Currency;
}

const ReceiptScanner: React.FC<ReceiptScannerProps> = ({ onSave, currency }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [scannedData, setScannedData] = useState<any | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string>(MOCK_CARDS[0].id);
  const [calculatedCashback, setCalculatedCashback] = useState<number>(0);
  const [dayOfWeekName, setDayOfWeekName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to calculate reward based on card rules and transaction date
  const calculateReward = (card: Card, data: any): number => {
    if (!data) return 0;
    
    const date = new Date(data.date);
    const dayOfWeek = date.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    let rate = 0;

    // 1. Check for specific day rates (e.g. Friday bonuses)
    if (card.specificDayRates && card.specificDayRates[dayOfWeek]) {
      const daySpecificRules = card.specificDayRates[dayOfWeek];
      if (daySpecificRules[data.category] !== undefined) {
        rate = daySpecificRules[data.category];
      } else if (daySpecificRules['Other'] !== undefined) {
        rate = daySpecificRules['Other'];
      }
    }

    // 2. Check for weekend rates if it's Sat/Sun and rate hasn't been set by specific day rule
    if (rate === 0 && isWeekend && card.weekendRates) {
      if (card.weekendRates[data.category] !== undefined) {
        rate = card.weekendRates[data.category];
      } else if (card.weekendRates['Other'] !== undefined) {
        rate = card.weekendRates['Other'];
      }
    }

    // 3. Fallback to base rates
    if (rate === 0) {
      rate = card.cashbackRates[data.category] || card.cashbackRates['Other'] || 0.00;
    }

    return data.amount * rate;
  };

  // Recalculate cashback whenever scannedData or selectedCardId changes
  useEffect(() => {
    if (scannedData) {
      const card = MOCK_CARDS.find(c => c.id === selectedCardId);
      if (card) {
        const reward = calculateReward(card, scannedData);
        setCalculatedCashback(reward);
        
        // Update day of week label for UI
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const d = new Date(scannedData.date);
        setDayOfWeekName(days[d.getDay()]);
      }
    }
  }, [scannedData, selectedCardId]);

  // When data is scanned, try to auto-identify the card
  useEffect(() => {
    if (scannedData && scannedData.cardUsed) {
      const aiDetectedName = scannedData.cardUsed.toLowerCase();
      const match = MOCK_CARDS.find(c => 
        aiDetectedName.includes(c.name.toLowerCase()) || 
        aiDetectedName.includes(c.bank.toLowerCase())
      );
      if (match) {
        setSelectedCardId(match.id);
      }
    }
  }, [scannedData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    }
  };

  const handleScan = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const result = await scanDocument(base64Data, file.type);
        setScannedData(result);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      alert("Error scanning document. Please try again.");
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!scannedData) return;
    
    const selectedCard = MOCK_CARDS.find(c => c.id === selectedCardId) || MOCK_CARDS[0];

    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      date: scannedData.date,
      merchant: scannedData.merchant,
      category: scannedData.category,
      amount: scannedData.amount,
      cardUsed: selectedCard.name, 
      cashbackEarned: calculatedCashback,
      potentialCashback: calculatedCashback,
      isOptimized: true
    };

    const detectedCurrency: Currency = {
      code: scannedData.currencyCode,
      symbol: scannedData.currencySymbol,
      name: `${scannedData.currencyCode} (Auto-detected)`
    };

    onSave(newTx, detectedCurrency);
    alert(`Transaction saved! Reward of ${detectedCurrency.symbol}${calculatedCashback.toFixed(2)} recorded for ${selectedCard.name} (${dayOfWeekName} rules applied).`);
    reset();
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setScannedData(null);
    setCalculatedCashback(0);
    setDayOfWeekName('');
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-10 flex flex-col items-center text-center">
        <div className="h-16 w-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 shadow-sm">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          </svg>
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">AI Document Intelligence</h2>
        <p className="text-slate-500 mt-2 text-lg">Extract data and auto-calculate complex Malaysian bank reward rules.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Upload Area */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          {!file ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-2xl p-16 flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50/30 hover:border-indigo-300 transition-all group"
            >
              <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-all mb-6">
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-xl font-black text-slate-800">Scan Receipt</p>
              <p className="text-sm text-slate-500 mt-2 text-center px-4">
                Upload your grocery, dining, or petrol receipt to see your rewards.
              </p>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*,application/pdf" 
                onChange={handleFileChange}
                className="hidden" 
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-6 flex flex-col items-center min-h-[300px] justify-center">
                {preview ? (
                  <img src={preview} alt="Preview" className="max-h-[250px] object-contain shadow-lg rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <div className="h-20 w-20 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-4">
                       <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-lg font-bold text-slate-700">{file.name}</p>
                  </div>
                )}
                <button 
                  onClick={reset}
                  className="absolute top-4 right-4 h-10 w-10 bg-white/90 text-slate-600 rounded-full flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-md"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {!scannedData && (
                <button
                  onClick={handleScan}
                  disabled={loading}
                  className={`w-full py-5 rounded-2xl font-black text-white text-lg transition-all shadow-xl shadow-indigo-100 ${
                    loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Extracting & Calculating...
                    </span>
                  ) : 'Scan Document'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results Pane */}
        <div>
          {scannedData ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Reward Calculation</h3>
                <div className="bg-amber-50 text-amber-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-amber-100 flex items-center">
                   <span className="mr-2">Day:</span> {dayOfWeekName}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center p-5 bg-slate-50 rounded-2xl border border-slate-100 group">
                  <div className="h-12 w-12 bg-white rounded-xl shadow-sm flex items-center justify-center mr-4 text-indigo-500">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Info</p>
                    <p className="text-lg font-black text-slate-900">{scannedData.merchant}</p>
                    <p className="text-[10px] text-slate-500 font-bold">{scannedData.date} • {scannedData.category}</p>
                  </div>
                </div>

                <div className="flex items-center p-5 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-inner">
                  <div className="h-12 w-12 bg-white rounded-xl shadow-sm flex items-center justify-center mr-4 text-emerald-500">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Rewards Captured</p>
                    <p className="text-3xl font-black text-emerald-700">
                      {scannedData.currencySymbol}{calculatedCashback.toFixed(2)}
                    </p>
                    <p className="text-[9px] text-emerald-600/70 font-bold uppercase tracking-widest">
                      Based on {dayOfWeekName} {scannedData.category} rates
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Spending</p>
                    <p className="text-xl font-black text-slate-600">{scannedData.currencySymbol}{scannedData.amount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Portfolio Selection</p>
                  <select 
                    value={selectedCardId}
                    onChange={(e) => setSelectedCardId(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
                  >
                    {MOCK_CARDS.map((card) => (
                      <option key={card.id} value={card.id}>
                        {card.name} ({card.bank})
                      </option>
                    ))}
                  </select>
                  <p className="text-[9px] text-slate-400 mt-2 italic px-1">
                    Picasso AI suggests rules for {dayOfWeekName} will be applied automatically to the selected card.
                  </p>
                </div>
              </div>

              <div className="flex space-x-3 mt-8">
                <button 
                  className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                  onClick={handleSave}
                >
                  Commit to Portfolio
                </button>
                <button 
                  className="px-6 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-all"
                  onClick={reset}
                >
                  Discard
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center opacity-80 min-h-[400px]">
              <div className="h-24 w-24 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6">
                <svg className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-black text-slate-400 uppercase tracking-widest">Calendar-Aware AI</h4>
              <p className="text-slate-400 mt-2 text-sm max-w-xs">Scan a receipt to see how the day of the week influences your card's rewards potential.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptScanner;
