import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ShieldAlert, Heart, ChevronDown, BookUser, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

// 模擬成員資料
const MEMBERS = [
  {
    id: 'm1',
    name: '阿倫 (Alan)',
    role: '🗺️ 導遊擔當',
    emoji: '🐶',
    bgColor: 'bg-[#E8F3E8]',
    phone: '+886 912 345 678',
    bloodType: 'O 型',
    emergencyContact: {
      name: '王大明 (父)',
      phone: '+886 987 654 321'
    }
  },
  {
    id: 'm2',
    name: '貝蒂 (Betty)',
    role: '📸 攝影大師',
    emoji: '🐱',
    bgColor: 'bg-[#FFF0E6]',
    phone: '+886 923 456 789',
    bloodType: 'A 型',
    emergencyContact: {
      name: '林美麗 (母)',
      phone: '+886 976 543 210'
    }
  },
  {
    id: 'm3',
    name: '查理 (Charlie)',
    role: '🍱 美食雷達',
    emoji: '🐻',
    bgColor: 'bg-[#E6F0FA]',
    phone: '+886 934 567 890',
    bloodType: 'B 型',
    emergencyContact: {
      name: '陳小美 (妻)',
      phone: '+886 965 432 109'
    }
  },
  {
    id: 'm4',
    name: '黛安 (Diane)',
    role: '🗣️ 隨行翻譯',
    emoji: '🐰',
    bgColor: 'bg-[#F5E6FA]',
    phone: '+886 945 678 901',
    bloodType: 'AB 型',
    emergencyContact: {
      name: '張志明 (夫)',
      phone: '+886 954 321 098'
    }
  }
];

// 緊急聯絡電話資料
const EMERGENCY_NUMBERS = [
  { label: '警察（事故、犯罪）', number: '110', desc: '日本國內直撥' },
  { label: '火災、救護車（急病）', number: '119', desc: '日本國內直撥' },
  { label: '日本旅遊專線', number: '050-3816-2787', desc: '24小時中文服務' },
  { label: '駐大阪辦事處 (急難救助)', number: '090-8794-4568', desc: '僅供緊急求助' },
  { label: '駐大阪辦事處 (辦公室)', number: '06-6227-8623', desc: '一般業務詢問' },
  { label: '外交部旅外緊急服務', number: '+886-3-398-5807', desc: '24小時專線' },
];

export default function Members() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* 頂部標題卡片 - 可翻轉 */}
      <motion.div 
        layout
        className="relative cursor-pointer" 
        onClick={() => setIsFlipped(!isFlipped)} 
        style={{ perspective: 1000 }}
      >
        {/* 隱藏的測量高度元素 */}
        <div className="invisible pointer-events-none" aria-hidden="true">
          {isFlipped ? (
            <div className="p-6 flex flex-col justify-center">
              <h2 className="text-xl font-black mb-4 text-center">📜 旅遊宣誓</h2>
              <div className="space-y-3 text-sm font-bold leading-relaxed">
                <p>擁抱彈性：保持行程隨興，美景多看一眼、美食多吃一口，平安開心是唯一標配。</p>
                <p>情緒止損：遇事不怪罪、不檢討，我們是解決問題的夥伴，不是製造問題的敵人。</p>
                <p>正向輸出：用讚美代替評論，把「好貴、難看、難吃」留在心裡，把「新鮮、特別、體驗」說出口。</p>
                <p>體貼守時：珍惜彼此相處的時間，準時是給旅伴最基本的浪漫與尊重。</p>
                <p>勇敢說愛：需求不隱瞞，想拍、想吃、想尿尿請大聲說，你的感受我都在乎。</p>
              </div>
            </div>
          ) : (
            <div className="p-6 flex items-center gap-4">
              <div className="w-16 h-16 shrink-0" />
              <div>
                <h2 className="text-2xl font-black">成員手冊</h2>
                <p className="text-sm font-bold mt-1">點擊頭像查看聯絡資訊</p>
                <p className="text-xs font-bold mt-2">✨ 點擊翻閱旅遊宣誓</p>
              </div>
            </div>
          )}
        </div>

        {/* 正面 */}
        <motion.div
          layout
          className="absolute inset-0 bg-white rounded-[2rem] p-6 shadow-soft border-2 border-[#E0E5D5] flex items-center gap-4"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
          style={{ backfaceVisibility: 'hidden', transformOrigin: 'center' }}
        >
          <div className="w-16 h-16 bg-[#F7F4EB] rounded-2xl flex items-center justify-center border-2 border-[#E0E5D5] shrink-0">
            <BookUser size={32} className="text-[#8D775F]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#8D775F]">成員手冊</h2>
            <p className="text-sm font-bold text-[#8FB7D3] mt-1">點擊頭像查看聯絡資訊</p>
            <p className="text-xs font-bold text-[#E5989B] mt-2 flex items-center gap-1">
              <span>✨</span> 點擊翻閱旅遊宣誓
            </p>
          </div>
        </motion.div>

        {/* 背面 */}
        <motion.div
          layout
          className="absolute inset-0 bg-[#F7F4EB] rounded-[2rem] p-6 shadow-soft border-2 border-[#E0E5D5] flex flex-col justify-center"
          initial={false}
          animate={{ rotateY: isFlipped ? 0 : -180 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
          style={{ backfaceVisibility: 'hidden', transformOrigin: 'center' }}
        >
          <h2 className="text-xl font-black text-[#8D775F] mb-4 text-center">📜 旅遊宣誓</h2>
          <div className="space-y-3 text-sm font-bold text-[#4A5D5D] leading-relaxed">
            <p><span className="text-[#E5989B]">擁抱彈性：</span>保持行程隨興，美景多看一眼、美食多吃一口，平安開心是唯一標配。</p>
            <p><span className="text-[#E5989B]">情緒止損：</span>遇事不怪罪、不檢討，我們是解決問題的夥伴，不是製造問題的敵人。</p>
            <p><span className="text-[#E5989B]">正向輸出：</span>用讚美代替評論，把「好貴、難看、難吃」留在心裡，把「新鮮、特別、體驗」說出口。</p>
            <p><span className="text-[#E5989B]">體貼守時：</span>珍惜彼此相處的時間，準時是給旅伴最基本的浪漫與尊重。</p>
            <p><span className="text-[#E5989B]">勇敢說愛：</span>需求不隱瞞，想拍、想吃、想尿尿請大聲說，你的感受我都在乎。</p>
          </div>
        </motion.div>
      </motion.div>

      {/* 成員列表 */}
      <div className="space-y-4">
        {MEMBERS.map((member) => {
          const isExpanded = expandedId === member.id;
          
          return (
            <motion.div 
              key={member.id}
              layout
              className="bg-white rounded-[2rem] shadow-soft border-2 border-[#E0E5D5] overflow-hidden"
            >
              {/* 縮合狀態 (點擊區域) */}
              <div 
                onClick={() => toggleExpand(member.id)}
                className="p-4 flex items-center gap-4 cursor-pointer active:bg-[#F7F4EB] transition-colors"
              >
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border-2 border-[#E0E5D5] shadow-sm shrink-0",
                  member.bgColor
                )}>
                  {member.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-extrabold text-[#4A5D5D]">{member.name}</h3>
                  <p className="text-sm font-bold text-[#8D775F] opacity-80">{member.role}</p>
                </div>
                <motion.div 
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  className="w-8 h-8 rounded-full bg-[#F7F4EB] flex items-center justify-center text-[#8D775F]"
                >
                  <ChevronDown size={20} />
                </motion.div>
              </div>

              {/* 展開狀態 (詳細資訊) */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t-2 border-dashed border-[#E0E5D5]"
                  >
                    <div className="p-5 space-y-4 bg-[#FAFAFA]">
                      {/* 個人電話 */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E8F3E8] flex items-center justify-center text-[#6B8E8E]">
                          <Phone size={18} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-[#8D775F] opacity-70">個人電話</p>
                          <a href={`tel:${member.phone}`} className="text-[#4A5D5D] font-bold text-lg hover:underline">
                            {member.phone}
                          </a>
                        </div>
                      </div>

                      {/* 緊急聯絡人 */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#FFF0E6] flex items-center justify-center text-[#E5989B]">
                          <Heart size={18} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-[#8D775F] opacity-70">緊急聯絡人：{member.emergencyContact.name}</p>
                          <a href={`tel:${member.emergencyContact.phone}`} className="text-[#4A5D5D] font-bold text-lg hover:underline">
                            {member.emergencyContact.phone}
                          </a>
                        </div>
                      </div>

                      {/* 血型/備註 */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E6F0FA] flex items-center justify-center text-[#6B8E8E]">
                          <ShieldAlert size={18} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-[#8D775F] opacity-70">血型 / 醫療備註</p>
                          <p className="text-[#4A5D5D] font-bold">{member.bloodType}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* 緊急聯絡電話區塊 */}
      <div className="mt-8 bg-[#FFF5F5] rounded-[2rem] p-6 shadow-soft border-2 border-[#FFD6D6]">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="text-[#E5989B]" size={24} />
          <h3 className="text-xl font-black text-[#D97777]">緊急求助電話</h3>
        </div>
        
        <div className="space-y-3">
          {EMERGENCY_NUMBERS.map((item, index) => (
            <a 
              key={index}
              href={`tel:${item.number}`}
              className="block bg-white p-4 rounded-xl border-2 border-[#FFD6D6] active:scale-95 transition-all shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-[#D97777]">{item.label}</h4>
                  <p className="text-xs font-bold text-[#8D775F] opacity-70 mt-1">{item.desc}</p>
                </div>
                <div className="bg-[#FFF5F5] px-3 py-1.5 rounded-lg border border-[#FFD6D6]">
                  <span className="font-black text-[#D97777] tracking-wider">{item.number}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
        
        <p className="text-xs font-bold text-[#D97777] opacity-70 mt-4 text-center">
          ※ 點擊卡片即可直接撥打電話
        </p>
      </div>
    </div>
  );
}
