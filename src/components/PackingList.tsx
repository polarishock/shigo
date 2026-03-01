import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, Trash2, Download } from 'lucide-react';
import { cn } from '../lib/utils';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  category: string;
  subcategory?: string;
  order?: number;
  createdAt: number;
}

const CATEGORIES = [
  { id: 'carry-on', label: '手提行李', icon: '🎒' },
  { id: 'checked', label: '托運行李', icon: '🧳' },
  { id: 'other', label: '其他準備', icon: '📝' },
  { id: 'notes', label: '注意事項', icon: '⚠️' },
];

const DEFAULT_LIST = [
  { category: 'carry-on', subcategory: '重要文件', items: ['護照', '護照影本', '大頭照2張', '身分證', '信用卡', '日幣現金', '機票/登機證', '住宿證明'] },
  { category: 'carry-on', subcategory: '機上用品', items: ['水壺', '頸枕', '眼罩', '筆'] },
  { category: 'carry-on', subcategory: '3C產品', items: ['手機', 'SIM卡', '充電線', '行動電源', '相機', '耳機'] },
  { category: 'carry-on', subcategory: '其他', items: ['衛生紙/棉', '個人藥品', '乳液等(小於100ml)'] },
  
  { category: 'checked', subcategory: '衣物類', items: ['外出服', '睡衣', '內衣褲', '襪子', '圍巾', '手套', '拖鞋', '太陽眼鏡', '帽子'] },
  { category: 'checked', subcategory: '盥洗類', items: ['牙刷', '牙膏', '洗髮精', '沐浴乳', '洗面乳', '梳子', '刮鬍刀', '指甲剪', '毛巾', '保養品', '防曬乳'] },
  { category: 'checked', subcategory: '其他', items: ['環保購物袋', '環保餐具', '掛勾/摺疊衣架', '口罩', '酒精棉片', '摺疊傘', '行李吊牌', '電子秤'] },
  
  { category: 'notes', subcategory: '只能手提', items: ['行動電源/鋰電池', '打火機'] },
  { category: 'notes', subcategory: '只能託運', items: ['刀類', '尖銳物品', '單瓶超過100ml液體', '管徑超過1cm,收合超過60cm之自拍棒或腳架'] },
  
  { category: 'other', subcategory: '行前準備', items: ['旅遊保險'] },
  { category: 'other', subcategory: '必備 APP', items: ['Japan Transit Planner', '食べログTabelog', 'TaxiGO', 'Payke', 'tenki.jp'] },
];

export const PackingList = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [input, setInput] = useState('');
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);

  // 1. 載入本地數據
  useEffect(() => {
    const saved = localStorage.getItem('shikoku_packingList');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTodos(parsed);
      } catch (e) {
        console.error('Failed to parse packing list', e);
      }
    }
  }, []);

  // 儲存到本地
  const saveTodos = (newTodos: TodoItem[]) => {
    setTodos(newTodos);
    localStorage.setItem('shikoku_packingList', JSON.stringify(newTodos));
  };

  // 2. 計算進度 (全部項目的總進度)
  const completedCount = todos.filter(t => t.completed).length;
  const progress = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

  // 篩選當前分類的項目
  const currentTodos = todos.filter(t => 
    t.category === activeCategory || (!t.category && activeCategory === 'carry-on')
  );

  // 將項目依據 subcategory 分組
  const groupedTodos = currentTodos.reduce((acc, todo) => {
    const sub = todo.subcategory || '新增項目';
    if (!acc[sub]) acc[sub] = [];
    acc[sub].push(todo);
    return acc;
  }, {} as Record<string, TodoItem[]>);

  // 排序 subcategory
  const subcategoryOrder = DEFAULT_LIST.map(g => g.subcategory);
  const sortedSubcategories = Object.keys(groupedTodos).sort((a, b) => {
    // 1. '新增項目' 永遠在最下面
    if (a === '新增項目') return 1;
    if (b === '新增項目') return -1;
    
    // 2. '其他' 放在 '新增項目' 上面
    if (a === '其他') return 1;
    if (b === '其他') return -1;

    // 3. 依照預設清單的順序排列
    const indexA = subcategoryOrder.indexOf(a);
    const indexB = subcategoryOrder.indexOf(b);
    
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    
    return indexA - indexB;
  });

  // 3. 新增邏輯
  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text: input, 
      completed: false, 
      category: activeCategory,
      subcategory: '新增項目',
      createdAt: Date.now()
    };
    
    saveTodos([...todos, newTodo]);
    setInput('');
  };

  // 4. 切換勾選
  const toggleItem = (id: string, currentStatus: boolean) => {
    saveTodos(todos.map(t => 
      t.id === id ? { ...t, completed: !currentStatus } : t
    ));
  };

  // 5. 刪除邏輯
  const deleteItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    saveTodos(todos.filter(t => t.id !== id));
  };

  // 6. 匯入預設清單
  const loadDefaultList = () => {
    if (todos.length > 0) {
      const confirm = window.confirm('目前已經有項目了，確定要加入預設清單嗎？（這會新增許多項目）');
      if (!confirm) return;
    }
    
    let orderIndex = 0;
    const newItems: TodoItem[] = [];
    
    DEFAULT_LIST.forEach(group => {
      group.items.forEach(text => {
        newItems.push({
          id: `default_${Date.now()}_${orderIndex}`,
          text,
          completed: false,
          category: group.category,
          subcategory: group.subcategory,
          order: orderIndex++,
          createdAt: Date.now()
        });
      });
    });
    
    saveTodos([...todos, ...newItems]);
  };

  return (
    <div className="space-y-6">
      {/* 頂部進度看板 */}
      <div className="bg-white rounded-[2rem] p-6 shadow-soft border-2 border-[#E0E5D5]">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-black text-[#8D775F]">行前準備</h2>
            <p className="text-xs font-bold text-[#8FB7D3] mt-1">總進度 {completedCount} / {todos.length} 項</p>
          </div>
          <button 
            onClick={loadDefaultList}
            className="px-3 py-2 bg-[#F7F4EB] text-[#8D775F] rounded-xl shadow-soft active:scale-95 transition-all flex items-center gap-1 text-xs font-bold border-2 border-[#E0E5D5]"
          >
            <Download size={14} />
            匯入預設
          </button>
        </div>
        {/* 動森感進度條 */}
        <div className="w-full h-4 bg-[#F0F0F0] rounded-full overflow-hidden border border-[#E0E5D5]">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-[#8FB7D3] rounded-full"
          />
        </div>
      </div>

      {/* 分類標籤 (橫向捲動) */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-2xl font-bold whitespace-nowrap transition-all border-2",
              activeCategory === cat.id 
                ? "bg-[#8FB7D3] text-white border-[#8FB7D3] shadow-soft active:shadow-soft-active active:translate-y-1" 
                : "bg-white text-[#8D775F] border-[#E0E5D5] hover:bg-[#F7F4EB]"
            )}
          >
            <span className="text-lg">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* 輸入區域 */}
      <form onSubmit={addItem} className="flex gap-2">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`新增${CATEGORIES.find(c => c.id === activeCategory)?.label}...`}
          className="flex-1 px-6 py-3 rounded-full border-2 border-[#E0E5D5] focus:outline-none focus:border-[#8FB7D3] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05)]"
        />
        <button type="submit" className="bg-[#8FB7D3] text-white p-3 rounded-full shadow-soft active:scale-90 transition-all">
          <Plus size={24} />
        </button>
      </form>

      {/* 清單列表 */}
      <div className="space-y-6 min-h-[200px]">
        <AnimatePresence mode="popLayout">
          {currentTodos.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="text-center py-12 text-[#8D775F] opacity-60 font-bold"
            >
              這個分類還空空的喔！點擊右上方「匯入預設」快速加入！
            </motion.div>
          )}
          
          {sortedSubcategories.map(sub => (
            <motion.div 
              key={sub}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <h3 className="text-[#8D775F] font-bold px-2 flex items-center gap-2 text-sm mt-4 mb-1">
                <div className="w-2 h-2 rounded-full bg-[#88B04B]" />
                {sub}
              </h3>
              
              {groupedTodos[sub].map((todo) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={todo.id}
                  onClick={() => toggleItem(todo.id, todo.completed)}
                  className={cn(
                    "bg-white p-3 rounded-xl border-2 transition-all flex items-center gap-3 cursor-pointer",
                    todo.completed ? 'border-[#88B04B]/30 bg-[#88B04B]/10 opacity-80' : 'border-[#E0E5D5] shadow-sm'
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0",
                    todo.completed ? 'bg-[#88B04B] border-[#88B04B]' : 'border-[#E0E5D5]'
                  )}>
                    {todo.completed && <Check size={12} className="text-white" />}
                  </div>
                  <span className={cn(
                    "flex-1 font-bold text-[#4A5D5D] text-base",
                  )}>
                    {todo.text}
                  </span>
                  <button 
                    onClick={(e) => deleteItem(e, todo.id)}
                    className="p-1.5 text-[#E0E5D5] hover:text-red-400 transition-colors shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
