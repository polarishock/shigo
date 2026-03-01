import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Utensils } from 'lucide-react';
import { ShoppingList } from '../components/ShoppingList';
import { FoodGuide } from '../components/FoodGuide';
import { cn } from '../lib/utils';

export default function Lists() {
  const [activeTab, setActiveTab] = useState<'shopping' | 'food'>('shopping');

  return (
    <div className="space-y-6">
      <div className="flex bg-[#F7F4EB] p-1.5 rounded-2xl border-2 border-[#E0E5D5] sticky top-0 z-20">
        <button 
          onClick={() => setActiveTab('shopping')} 
          className={cn(
            "flex-1 py-2 rounded-xl font-black text-xs transition-all flex flex-col items-center justify-center gap-1", 
            activeTab === 'shopping' ? "bg-white shadow-sm text-[#4A5D5D]" : "text-[#8D775F] opacity-60 hover:opacity-100"
          )}
        >
          <ShoppingBag size={16} />
          伴手禮清單
        </button>
        <button 
          onClick={() => setActiveTab('food')} 
          className={cn(
            "flex-1 py-2 rounded-xl font-black text-xs transition-all flex flex-col items-center justify-center gap-1", 
            activeTab === 'food' ? "bg-white shadow-sm text-[#4A5D5D]" : "text-[#8D775F] opacity-60 hover:opacity-100"
          )}
        >
          <Utensils size={16} />
          四國美食圖鑑
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab} 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -10 }} 
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'shopping' && <ShoppingList />}
          {activeTab === 'food' && <FoodGuide />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
