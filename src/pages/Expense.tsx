import React, { useState, useEffect, useMemo, memo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Receipt, Calculator, Camera, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '../lib/utils';

// 模擬成員名單
const MEMBERS = ['阿倫', '貝蒂', '查理', '黛安'];
const CURRENT_USER = { name: '阿倫', emoji: '🐶' };

interface ExpenseRecord {
  id: string;
  item: string;
  amount: number;
  icon: string;
  payer: string;
  receiptUrl?: string;
  createdAt: number;
}

// 自動判斷 Icon 的小工具
const getIconForItem = (itemName: string) => {
  if (itemName.includes('吃') || itemName.includes('餐') || itemName.includes('麵') || itemName.includes('肉')) return '🍜';
  if (itemName.includes('車') || itemName.includes('交通') || itemName.includes('JR') || itemName.includes('地鐵')) return '🚃';
  if (itemName.includes('住') || itemName.includes('飯店') || itemName.includes('旅館')) return '🏨';
  if (itemName.includes('買') || itemName.includes('藥妝') || itemName.includes('伴手禮')) return '🛍️';
  if (itemName.includes('玩') || itemName.includes('門票') || itemName.includes('迪士尼')) return '🎟️';
  return '💸';
};

const ExpenseItem = memo(({ data, rate, onDelete }: { data: ExpenseRecord, rate: number, onDelete: (id: string) => void }) => {
  const [showReceipt, setShowReceipt] = useState(false);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col p-4 bg-white rounded-2xl border-2 border-[#E0E5D5] mb-3 shadow-soft group"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl bg-[#F7F4EB] w-12 h-12 flex items-center justify-center rounded-xl border border-[#E0E5D5]">{data.icon}</span>
          <div>
            <p className="font-black text-[#4A5D5D] text-lg flex items-center gap-2">
              {data.item}
              {data.receiptUrl && (
                <button 
                  onClick={() => setShowReceipt(!showReceipt)}
                  className="text-[#8FB7D3] hover:text-[#5A7D9A] transition-colors bg-[#E3F2FD] p-1 rounded-md"
                >
                  <ImageIcon size={14} />
                </button>
              )}
            </p>
            <p className="text-xs font-bold text-[#6B8E8E] uppercase">{data.payer} 付款</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-black text-[#8D775F] text-lg">¥{data.amount.toLocaleString()}</p>
            <p className="text-[10px] font-bold text-[#8D775F] opacity-60">約 NT${Math.round(data.amount * rate).toLocaleString()}</p>
          </div>
          <button 
            onClick={() => onDelete(data.id)}
            className="p-2 text-[#E0E5D5] hover:text-[#D97777] transition-colors active:scale-90"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        {showReceipt && data.receiptUrl && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border-2 border-[#E0E5D5] overflow-hidden bg-[#F7F4EB] p-2">
              <img src={data.receiptUrl} alt="Receipt" className="w-full h-auto max-h-48 object-contain rounded-lg" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default function Expense() {
  const [activeTab, setActiveTab] = useState<'list' | 'settlement'>('list');
  const [amount, setAmount] = useState("");
  const [item, setItem] = useState("");
  const [payer, setPayer] = useState(CURRENT_USER.name);
  const [records, setRecords] = useState<ExpenseRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const JPY_RATE = 0.21; // 固定匯率

  // 1. 載入本地數據
  useEffect(() => {
    const saved = localStorage.getItem('shikoku_expenses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRecords(parsed);
      } catch (e) {
        console.error('Failed to parse expenses', e);
      }
    }
  }, []);

  // 儲存到本地
  const saveRecords = (newRecords: ExpenseRecord[]) => {
    setRecords(newRecords);
    localStorage.setItem('shikoku_expenses', JSON.stringify(newRecords));
  };

  // 計算總支出
  const totalJPY = useMemo(() => records.reduce((s, r) => s + r.amount, 0), [records]);

  // 計算結算資料
  const settlement = useMemo(() => {
    const paidByMember = MEMBERS.reduce((acc, member) => {
      acc[member] = 0;
      return acc;
    }, {} as Record<string, number>);

    records.forEach(r => {
      if (paidByMember[r.payer] !== undefined) {
        paidByMember[r.payer] += r.amount;
      } else {
        paidByMember[r.payer] = r.amount;
      }
    });

    const allMembers = Object.keys(paidByMember);
    const actualPerPerson = totalJPY / Math.max(1, allMembers.length);

    return allMembers.map(member => {
      const paid = paidByMember[member];
      const balance = paid - actualPerPerson;
      return { member, paid, balance };
    }).sort((a, b) => b.balance - a.balance);
  }, [records, totalJPY]);

  // 新增記帳
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !item.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      let receiptUrl = null;
      if (receiptFile) {
        // 使用 Canvas 壓縮圖片以節省 localStorage 空間
        const compressedBase64 = await compressImage(receiptFile);
        receiptUrl = compressedBase64;
      }

      const newRecord: ExpenseRecord = {
        id: Date.now().toString(),
        item: item.trim(),
        amount: Number(amount),
        icon: getIconForItem(item),
        payer: payer,
        receiptUrl: receiptUrl || undefined,
        createdAt: Date.now()
      };

      saveRecords([newRecord, ...records]);
      
      setAmount("");
      setItem("");
      clearReceipt();
    } catch (error) {
      console.error("Error adding expense:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          resolve(canvas.toDataURL('image/jpeg', 0.6));
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReceiptFile(file);
      setReceiptPreview(URL.createObjectURL(file));
    }
  };

  const clearReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 刪除記帳
  const handleDelete = (id: string) => {
    if (window.confirm('確定要刪除這筆記帳嗎？')) {
      saveRecords(records.filter(r => r.id !== id));
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* 1. 總覽儀表板 */}
      <div className="bg-[#F9E498] p-6 rounded-[2.5rem] border-4 border-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-4 -top-4 text-6xl opacity-20">💰</div>
        <p className="text-sm font-black text-[#8D775F]">目前小隊總支出</p>
        <div className="flex items-baseline gap-2 mt-1">
          <h2 className="text-4xl font-black text-[#4A5D5D]">¥ {totalJPY.toLocaleString()}</h2>
        </div>
        <div className="mt-3 inline-block bg-white/50 px-3 py-1 rounded-lg border border-white/60">
          <p className="text-sm font-bold text-[#8D775F]">約 NT$ {Math.round(totalJPY * JPY_RATE).toLocaleString()}</p>
        </div>
      </div>

      {/* 頁籤切換 */}
      <div className="flex bg-[#F7F4EB] p-1.5 rounded-2xl border-2 border-[#E0E5D5]">
        <button 
          onClick={() => setActiveTab('list')}
          className={cn(
            "flex-1 py-2.5 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2", 
            activeTab === 'list' ? "bg-white shadow-sm text-[#4A5D5D]" : "text-[#8D775F] opacity-60 hover:opacity-100"
          )}
        >
          <Receipt size={16} />
          記帳清單
        </button>
        <button 
          onClick={() => setActiveTab('settlement')}
          className={cn(
            "flex-1 py-2.5 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2", 
            activeTab === 'settlement' ? "bg-white shadow-sm text-[#4A5D5D]" : "text-[#8D775F] opacity-60 hover:opacity-100"
          )}
        >
          <Calculator size={16} />
          分帳結算
        </button>
      </div>

      {activeTab === 'list' ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* 2. 快速記帳區 */}
          <form onSubmit={handleAddExpense} className="bg-white p-5 rounded-[2rem] border-2 border-[#E0E5D5] shadow-soft space-y-4">
            <div className="flex gap-2 items-center">
              <span className="text-xl font-black text-[#8D775F] pl-2">¥</span>
              <input 
                type="number" 
                placeholder="輸入日幣金額..." 
                className="flex-1 bg-[#F7F4EB] p-4 rounded-2xl font-black text-xl text-[#4A5D5D] focus:ring-2 ring-[#F4D03F] outline-none border border-[#E0E5D5]"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <input 
                placeholder="備註 (例如: 買藥妝)" 
                className="flex-1 bg-[#F7F4EB] px-4 py-3 rounded-xl font-bold text-sm outline-none border border-[#E0E5D5] focus:ring-2 ring-[#F4D03F]"
                value={item}
                onChange={(e) => setItem(e.target.value)}
              />
            </div>

            {/* 預覽發票照片 */}
            {receiptPreview && (
              <div className="relative inline-block">
                <img src={receiptPreview} alt="Receipt preview" className="h-20 w-20 object-cover rounded-xl border-2 border-[#E0E5D5]" />
                <button 
                  type="button"
                  onClick={clearReceipt}
                  className="absolute -top-2 -right-2 bg-[#D97777] text-white rounded-full p-1 shadow-sm hover:scale-110 transition-transform"
                >
                  <X size={12} />
                </button>
              </div>
            )}

            <div className="flex gap-2 items-center">
              <select 
                value={payer}
                onChange={(e) => setPayer(e.target.value)}
                className="bg-[#F7F4EB] px-3 py-3 rounded-xl font-bold text-sm outline-none border border-[#E0E5D5] focus:ring-2 ring-[#F4D03F] text-[#4A5D5D]"
              >
                {MEMBERS.map(m => (
                  <option key={m} value={m}>{m} 付款</option>
                ))}
              </select>

              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#F7F4EB] p-3 rounded-xl border border-[#E0E5D5] text-[#8D775F] hover:bg-[#E0E5D5] transition-colors"
                title="上傳發票/收據"
              >
                <Camera size={20} />
              </button>

              <button 
                type="submit"
                disabled={isSubmitting || !amount || !item.trim()}
                className={cn(
                  "flex-1 bg-gradient-to-b from-[#FFF59D] to-[#F4D03F] text-[#8D775F] px-4 py-3 rounded-xl font-black shadow-soft active:scale-95 transition-all border-2 border-[#D4AC0D]",
                  (isSubmitting || !amount || !item.trim()) && "opacity-50 cursor-not-allowed active:scale-100"
                )}
              >
                {isSubmitting ? '...' : '記帳 🍋'}
              </button>
            </div>
          </form>

          {/* 3. 支出清單 */}
          <div>
            <h3 className="text-sm font-black text-[#8D775F] ml-2 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F4D03F]" />
              最近的支出回條 🧾
            </h3>
            
            {records.length === 0 ? (
              <div className="text-center py-12 opacity-60">
                <p className="font-bold text-[#8D775F]">還沒有任何花費喔！<br/>大家都很省錢呢 💸</p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {records.map(rec => (
                    <ExpenseItem key={rec.id} data={rec} rate={JPY_RATE} onDelete={handleDelete} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-white p-6 rounded-[2rem] border-2 border-[#E0E5D5] shadow-soft">
            <div className="flex justify-between items-end mb-6 pb-4 border-b-2 border-dashed border-[#E0E5D5]">
              <div>
                <p className="text-xs font-bold text-[#8D775F] mb-1">總人數 {settlement.length} 人</p>
                <h3 className="font-black text-[#4A5D5D] text-xl">
                  每人應付 ¥ {Math.round(totalJPY / Math.max(1, settlement.length)).toLocaleString()}
                </h3>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-[#8D775F] opacity-60">約 NT$ {Math.round((totalJPY / Math.max(1, settlement.length)) * JPY_RATE).toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-3">
              {settlement.map(s => (
                <div key={s.member} className="flex items-center justify-between p-4 bg-[#F7F4EB] rounded-2xl border border-[#E0E5D5]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center font-black text-xl text-[#4A5D5D] border-2 border-[#E0E5D5] shadow-sm">
                      {s.member.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-[#4A5D5D] text-lg">{s.member}</p>
                      <p className="text-xs font-bold text-[#8D775F]">已付 ¥{s.paid.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {s.balance > 0 ? (
                      <>
                        <p className="font-black text-[#2A9D8F] text-lg">應收</p>
                        <p className="font-black text-[#2A9D8F]">¥{Math.round(s.balance).toLocaleString()}</p>
                      </>
                    ) : s.balance < 0 ? (
                      <>
                        <p className="font-black text-[#E76F51] text-lg">應補</p>
                        <p className="font-black text-[#E76F51]">¥{Math.round(Math.abs(s.balance)).toLocaleString()}</p>
                      </>
                    ) : (
                      <p className="font-black text-[#8D775F] bg-[#E0E5D5]/50 px-3 py-1 rounded-lg">結清</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 bg-[#E3F2FD]/50 p-4 rounded-xl border border-[#8FB7D3]/30">
              <p className="text-xs font-bold text-[#5A7D9A] text-center">
                💡 結算邏輯：(總支出 ÷ 總人數) - 個人已付金額<br/>
                正數代表別人要給你錢，負數代表你要給別人錢
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
