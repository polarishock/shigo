import React, { useState, useEffect } from 'react';
import { Calculator, ArrowRightLeft, Percent } from 'lucide-react';
import { cn } from '../lib/utils';

export function CurrencyConverter() {
  const [jpy, setJpy] = useState<string>('');
  const [twd, setTwd] = useState<string>('');
  const [isJpyToTwd, setIsJpyToTwd] = useState(true);
  
  // 預設匯率，可以讓使用者修改
  const [rate, setRate] = useState<number>(0.21);

  const handleJpyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setJpy(val);
    if (val === '') {
      setTwd('');
    } else {
      setTwd((parseFloat(val) * rate).toFixed(0));
    }
  };

  const handleTwdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTwd(val);
    if (val === '') {
      setJpy('');
    } else {
      setJpy((parseFloat(val) / rate).toFixed(0));
    }
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRate = parseFloat(e.target.value);
    if (!isNaN(newRate)) {
      setRate(newRate);
      if (jpy !== '') {
        setTwd((parseFloat(jpy) * newRate).toFixed(0));
      }
    }
  };

  const calculateTaxFree = () => {
    if (jpy) {
      const amount = parseFloat(jpy);
      return (amount / 1.1).toFixed(0);
    }
    return '0';
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="bg-white p-6 rounded-[2rem] border-2 border-[#E0E5D5] shadow-soft space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-[#4A5D5D] flex items-center gap-2">
            <Calculator size={24} className="text-[#F4D03F]" />
            匯率換算機 💱
          </h2>
          <div className="flex items-center gap-2 bg-[#F7F4EB] px-3 py-1.5 rounded-xl border border-[#E0E5D5]">
            <span className="text-xs font-bold text-[#8D775F]">匯率</span>
            <input 
              type="number" 
              step="0.001"
              value={rate}
              onChange={handleRateChange}
              className="w-16 bg-transparent font-black text-[#4A5D5D] outline-none text-right"
            />
          </div>
        </div>

        <div className="relative flex flex-col gap-4 bg-[#F7F4EB] p-4 rounded-2xl border-2 border-[#E0E5D5]">
          {/* 日幣輸入 */}
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-[#E0E5D5] shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FFD6D6] flex items-center justify-center text-lg font-black text-[#D97777]">
                ¥
              </div>
              <span className="font-black text-[#4A5D5D]">日幣 JPY</span>
            </div>
            <input 
              type="number" 
              value={jpy}
              onChange={handleJpyChange}
              placeholder="0"
              className="w-1/2 text-right text-2xl font-black text-[#4A5D5D] outline-none bg-transparent"
            />
          </div>

          {/* 切換按鈕 (視覺用) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#F4D03F] rounded-full flex items-center justify-center border-4 border-[#F7F4EB] shadow-sm z-10">
            <ArrowRightLeft size={16} className="text-white rotate-90" />
          </div>

          {/* 台幣輸入 */}
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-[#E0E5D5] shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E3F2FD] flex items-center justify-center text-lg font-black text-[#5A7D9A]">
                $
              </div>
              <span className="font-black text-[#4A5D5D]">台幣 TWD</span>
            </div>
            <input 
              type="number" 
              value={twd}
              onChange={handleTwdChange}
              placeholder="0"
              className="w-1/2 text-right text-2xl font-black text-[#4A5D5D] outline-none bg-transparent"
            />
          </div>
        </div>

        {/* 免稅小幫手 */}
        <div className="bg-[#FFF3E0] p-4 rounded-2xl border-2 border-[#FFCC80] flex items-start gap-3">
          <div className="p-2 bg-white rounded-xl shadow-sm">
            <Percent size={20} className="text-[#E65100]" />
          </div>
          <div>
            <h3 className="font-black text-[#E65100] mb-1">免稅小幫手 (10% off)</h3>
            <p className="text-xs font-bold text-[#8D775F] mb-2">
              日本免稅門檻為未稅價 5,000 日圓（含稅 5,500 日圓）。
            </p>
            {jpy && parseFloat(jpy) > 0 ? (
              <div className="bg-white px-3 py-2 rounded-xl border border-[#FFCC80] inline-block">
                <span className="text-xs font-bold text-[#8D775F] mr-2">免稅後約為：</span>
                <span className="font-black text-[#E65100] text-lg">¥ {calculateTaxFree()}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
