import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ShoppingBag, Utensils, Train, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../lib/utils';

const PHRASE_CATEGORIES = [
  {
    id: 'greetings',
    title: '基本問候',
    icon: MessageCircle,
    color: 'bg-[#E3F2FD]',
    textColor: 'text-[#5A7D9A]',
    phrases: [
      { zh: '你好', jp: 'こんにちは', romaji: 'Konnichiwa' },
      { zh: '謝謝', jp: 'ありがとうございます', romaji: 'Arigatou gozaimasu' },
      { zh: '對不起 / 不好意思', jp: 'すみません', romaji: 'Sumimasen' },
      { zh: '拜託了 / 請', jp: 'お願いします', romaji: 'Onegaishimasu' },
      { zh: '早安', jp: 'おはようございます', romaji: 'Ohayou gozaimasu' },
    ]
  },
  {
    id: 'dining',
    title: '餐廳用餐',
    icon: Utensils,
    color: 'bg-[#FFF3E0]',
    textColor: 'text-[#E65100]',
    phrases: [
      { zh: '請給我菜單', jp: 'メニューをお願いします', romaji: 'Menyu o onegaishimasu' },
      { zh: '我要點這個', jp: 'これをください', romaji: 'Kore o kudasai' },
      { zh: '請結帳', jp: 'お会計をお願いします', romaji: 'Okaikei o onegaishimasu' },
      { zh: '有中文菜單嗎？', jp: '中国語のメニューはありますか？', romaji: 'Chuugokugo no menyu wa arimasuka?' },
      { zh: '不用找錢了', jp: 'お釣りは結構です', romaji: 'Otsuri wa kekkou desu' },
    ]
  },
  {
    id: 'shopping',
    title: '購物免稅',
    icon: ShoppingBag,
    color: 'bg-[#F5E6FA]',
    textColor: 'text-[#8D775F]',
    phrases: [
      { zh: '多少錢？', jp: 'いくらですか？', romaji: 'Ikura desuka?' },
      { zh: '可以免稅嗎？', jp: '免税できますか？', romaji: 'Menzei dekimasuka?' },
      { zh: '可以刷卡嗎？', jp: 'クレジットカードは使えますか？', romaji: 'Kurejitto kaado wa tsukaemasuka?' },
      { zh: '請給我大一點的尺寸', jp: 'もう少し大きいサイズはありますか？', romaji: 'Mou sukoshi ookii saizu wa arimasuka?' },
      { zh: '我要買這個', jp: 'これを買います', romaji: 'Kore o kaimasu' },
    ]
  },
  {
    id: 'transport',
    title: '交通問路',
    icon: Train,
    color: 'bg-[#E8F3E8]',
    textColor: 'text-[#4A5D5D]',
    phrases: [
      { zh: '請問車站在哪裡？', jp: '駅はどこですか？', romaji: 'Eki wa doko desuka?' },
      { zh: '這班車會到高松嗎？', jp: 'この電車は高松に行きますか？', romaji: 'Kono densha wa Takamatsu ni ikimasuka?' },
      { zh: '請到這個地址', jp: 'この住所までお願いします', romaji: 'Kono juusho made onegaishimasu' },
      { zh: '請問洗手間在哪裡？', jp: 'トイレはどこですか？', romaji: 'Toire wa doko desuka?' },
    ]
  },
  {
    id: 'emergency',
    title: '緊急狀況',
    icon: AlertTriangle,
    color: 'bg-[#FFD6D6]',
    textColor: 'text-[#D97777]',
    phrases: [
      { zh: '救命！', jp: '助けて！', romaji: 'Tasukete!' },
      { zh: '請叫救護車', jp: '救急車を呼んでください', romaji: 'Kyuukyuusha o yonde kudasai' },
      { zh: '請叫警察', jp: '警察を呼んでください', romaji: 'Keisatsu o yonde kudasai' },
      { zh: '我弄丟了護照', jp: 'パスポートをなくしました', romaji: 'Pasupooto o nakushimashita' },
      { zh: '我迷路了', jp: '道に迷いました', romaji: 'Michi ni mayoimashita' },
    ]
  }
];

export function Phrases() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('greetings');

  return (
    <div className="space-y-4 pb-8">
      <div className="bg-white p-5 rounded-[2rem] border-2 border-[#E0E5D5] shadow-soft">
        <h2 className="text-xl font-black text-[#4A5D5D] mb-1">實用日語字卡 🗣️</h2>
        <p className="text-xs font-bold text-[#8D775F] opacity-80 mb-4">點擊卡片可以放大給日本人看喔！</p>
        
        <div className="space-y-3">
          {PHRASE_CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isExpanded = expandedCategory === category.id;
            
            return (
              <div key={category.id} className="border-2 border-[#E0E5D5] rounded-2xl overflow-hidden bg-[#F7F4EB]">
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 transition-colors",
                    isExpanded ? category.color : "bg-white hover:bg-[#F7F4EB]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-xl bg-white shadow-sm", category.textColor)}>
                      <Icon size={20} />
                    </div>
                    <span className={cn("font-black text-lg", category.textColor)}>{category.title}</span>
                  </div>
                  {isExpanded ? <ChevronUp size={20} className={category.textColor} /> : <ChevronDown size={20} className="text-[#8D775F]" />}
                </button>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 space-y-3">
                        {category.phrases.map((phrase, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-xl border border-[#E0E5D5] shadow-sm active:scale-95 transition-transform">
                            <p className="text-xs font-bold text-[#8D775F] mb-1">{phrase.zh}</p>
                            <p className="text-xl font-black text-[#4A5D5D] mb-1">{phrase.jp}</p>
                            <p className="text-[10px] font-mono text-[#6B8E8E] uppercase tracking-wider">{phrase.romaji}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
