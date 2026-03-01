import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, ShoppingBag, Gift, DollarSign } from 'lucide-react';
import { cn } from '../lib/utils';

interface ShoppingItem {
  id: string;
  name: string;
  forWhom: string;
  price: string;
  isBought: boolean;
}

export function ShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    const saved = localStorage.getItem('shikoku_shopping');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: '小豆島橄欖油', forWhom: '媽媽', price: '1500', isBought: false },
      { id: '2', name: '讚岐烏龍麵 (半生麵)', forWhom: '自己', price: '1000', isBought: false },
      { id: '3', name: '合利他命 EX PLUS', forWhom: '阿公', price: '5500', isBought: false },
    ];
  });
  
  const [newItemName, setNewItemName] = useState('');
  const [newItemFor, setNewItemFor] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');

  useEffect(() => {
    localStorage.setItem('shikoku_shopping', JSON.stringify(items));
  }, [items]);

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: newItemName,
      forWhom: newItemFor || '自己',
      price: newItemPrice || '未定',
      isBought: false
    };
    setItems([...items, newItem]);
    setNewItemName('');
    setNewItemFor('');
    setNewItemPrice('');
  };

  const toggleBought = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, isBought: !item.isBought } : item));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const boughtCount = items.filter(i => i.isBought).length;

  return (
    <div className="space-y-6 pb-8">
      <div className="bg-white p-5 rounded-[2rem] border-2 border-[#E0E5D5] shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-[#4A5D5D] flex items-center gap-2">
            <ShoppingBag className="text-[#D97777]" />
            伴手禮清單 🛍️
          </h2>
          <div className="bg-[#F7F4EB] px-3 py-1 rounded-xl border border-[#E0E5D5] text-xs font-bold text-[#8D775F]">
            進度 {boughtCount}/{items.length}
          </div>
        </div>

        {/* 新增表單 */}
        <form onSubmit={addItem} className="bg-[#F7F4EB] p-4 rounded-2xl border-2 border-[#E0E5D5] mb-6 space-y-3">
          <input
            type="text"
            placeholder="要買什麼？ (例如：合利他命)"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="w-full bg-white p-3 rounded-xl border border-[#E0E5D5] font-bold text-[#4A5D5D] outline-none focus:border-[#8FB7D3]"
          />
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Gift size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8D775F] opacity-50" />
              <input
                type="text"
                placeholder="買給誰？"
                value={newItemFor}
                onChange={(e) => setNewItemFor(e.target.value)}
                className="w-full bg-white p-3 pl-9 rounded-xl border border-[#E0E5D5] font-bold text-[#4A5D5D] outline-none focus:border-[#8FB7D3] text-sm"
              />
            </div>
            <div className="flex-1 relative">
              <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8D775F] opacity-50" />
              <input
                type="number"
                placeholder="預期價格(¥)"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                className="w-full bg-white p-3 pl-9 rounded-xl border border-[#E0E5D5] font-bold text-[#4A5D5D] outline-none focus:border-[#8FB7D3] text-sm"
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-[#8FB7D3] text-white p-3 rounded-xl font-black flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-sm">
            <Plus size={18} />
            加入清單
          </button>
        </form>

        {/* 清單列表 */}
        <div className="space-y-3">
          {items.map(item => (
            <div 
              key={item.id} 
              className={cn(
                "flex items-center gap-3 p-3 rounded-2xl border-2 transition-all",
                item.isBought ? "bg-[#F7F4EB] border-[#E0E5D5] opacity-60" : "bg-white border-[#E0E5D5] shadow-sm"
              )}
            >
              <button 
                onClick={() => toggleBought(item.id)}
                className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                  item.isBought ? "bg-[#8FB7D3] border-[#8FB7D3] text-white" : "border-[#E0E5D5] text-transparent hover:border-[#8FB7D3]"
                )}
              >
                <Check size={16} strokeWidth={3} />
              </button>
              
              <div className="flex-1 min-w-0">
                <p className={cn("font-black text-[#4A5D5D] truncate", item.isBought && "line-through")}>
                  {item.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-[#FFF3E0] text-[#E65100] px-2 py-0.5 rounded-md text-[10px] font-bold">
                    給: {item.forWhom}
                  </span>
                  <span className="bg-[#E3F2FD] text-[#5A7D9A] px-2 py-0.5 rounded-md text-[10px] font-bold">
                    ¥ {item.price}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => deleteItem(item.id)}
                className="p-2 text-[#D97777] opacity-50 hover:opacity-100 transition-opacity"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center py-8 text-[#8D775F] font-bold opacity-50">
              目前沒有待買物品喔！
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
