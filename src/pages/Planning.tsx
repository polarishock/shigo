import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, MessageCircle, Calculator, Map, Landmark } from 'lucide-react';
import { PackingList } from '../components/PackingList';
import { Phrases } from '../components/Phrases';
import { CurrencyConverter } from '../components/CurrencyConverter';
import { TransitMaps } from '../components/TransitMaps';
import { Attractions } from '../components/Attractions';
import { cn } from '../lib/utils';

export default function Planning() {
  const [activeTab, setActiveTab] = useState<'packing' | 'phrases' | 'currency' | 'maps' | 'attractions'>('packing');

  const tabs = [
    { id: 'packing', label: '行李清單', icon: CheckSquare },
    { id: 'phrases', label: '實用語句', icon: MessageCircle },
    { id: 'currency', label: '匯率換算', icon: Calculator },
    { id: 'maps', label: '路線圖', icon: Map },
    { id: 'attractions', label: '景點資訊', icon: Landmark },
  ] as const;

  return (
    <div className="space-y-6">
      {/* 頁籤切換 */}
      <div className="flex bg-[#F7F4EB] p-1.5 rounded-2xl border-2 border-[#E0E5D5] sticky top-0 z-20 overflow-x-auto gap-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-none min-w-[72px] flex-1 py-2 rounded-xl font-black text-[11px] transition-all flex flex-col items-center justify-center gap-1", 
                isActive ? "bg-white shadow-sm text-[#4A5D5D]" : "text-[#8D775F] opacity-60 hover:opacity-100"
              )}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'packing' && <PackingList />}
          {activeTab === 'phrases' && <Phrases />}
          {activeTab === 'currency' && <CurrencyConverter />}
          {activeTab === 'maps' && <TransitMaps />}
          {activeTab === 'attractions' && <Attractions />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
