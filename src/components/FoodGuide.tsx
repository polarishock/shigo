import React, { useState, useEffect } from 'react';
import { Utensils, MapPin, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

const FOODS = [
  { 
    id: 'udon', 
    name: '讚岐烏龍麵', 
    region: '香川', 
    desc: '來香川必吃！口感Q彈有勁，推薦嘗試「釜玉烏龍麵」或「醬油烏龍麵」。', 
    color: 'bg-[#E3F2FD]', 
    textColor: 'text-[#5A7D9A]',
    emoji: '🍜'
  },
  { 
    id: 'katsuo', 
    name: '炙烤鰹魚 (鰹のタタキ)', 
    region: '高知', 
    desc: '用稻草大火炙烤表面，帶有獨特香氣，搭配蒜片、蔥花和柚子醋簡直絕配！', 
    color: 'bg-[#FFD6D6]', 
    textColor: 'text-[#D97777]',
    emoji: '🐟'
  },
  { 
    id: 'honetsuki', 
    name: '骨付鳥', 
    region: '香川 (丸龜)', 
    desc: '帶骨烤雞腿，分為有嚼勁的「老雞(親どり)」和多汁柔軟的「幼雞(ひなどり)」，非常下酒。', 
    color: 'bg-[#FFF3E0]', 
    textColor: 'text-[#E65100]',
    emoji: '🍗'
  },
  { 
    id: 'ramen', 
    name: '德島拉麵', 
    region: '德島', 
    desc: '濃郁的豚骨醬油湯頭，配上生雞蛋和豬五花肉片，非常下飯的重口味拉麵。', 
    color: 'bg-[#F5E6FA]', 
    textColor: 'text-[#8D775F]',
    emoji: '🍲'
  },
  { 
    id: 'mikan', 
    name: '蜜柑甜點', 
    region: '愛媛', 
    desc: '愛媛縣盛產柑橘，各種蜜柑果汁、大福、冰淇淋都不能錯過！', 
    color: 'bg-[#FFF9C4]', 
    textColor: 'text-[#F5B041]',
    emoji: '🍊'
  },
];

export function FoodGuide() {
  const [eaten, setEaten] = useState<string[]>(() => {
    const saved = localStorage.getItem('shikoku_food_eaten');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('shikoku_food_eaten', JSON.stringify(eaten));
  }, [eaten]);

  const toggleEaten = (id: string) => {
    if (eaten.includes(id)) {
      setEaten(eaten.filter(e => e !== id));
    } else {
      setEaten([...eaten, id]);
    }
  };

  return (
    <div className="space-y-4 pb-8">
      <div className="bg-white p-5 rounded-[2rem] border-2 border-[#E0E5D5] shadow-soft">
        <h2 className="text-xl font-black text-[#4A5D5D] mb-4 flex items-center gap-2">
          <Utensils className="text-[#E65100]" />
          四國必吃美食圖鑑 🤤
        </h2>

        <div className="space-y-4">
          {FOODS.map((food) => {
            const isEaten = eaten.includes(food.id);
            return (
              <div 
                key={food.id} 
                className={cn(
                  "border-2 rounded-2xl overflow-hidden p-4 relative transition-all",
                  isEaten ? "border-[#E0E5D5] bg-[#F7F4EB] opacity-80" : "border-[#E0E5D5] bg-white shadow-sm"
                )}
              >
                {/* 已完食印章 */}
                {isEaten && (
                  <div className="absolute right-4 top-4 rotate-12 z-10 pointer-events-none">
                    <div className="border-4 border-[#D97777] text-[#D97777] rounded-full w-16 h-16 flex items-center justify-center font-black text-sm transform -rotate-12 opacity-80 shadow-sm">
                      已完食
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{food.emoji}</span>
                    <div>
                      <h3 className="text-lg font-black text-[#4A5D5D]">{food.name}</h3>
                      <div className="flex items-center gap-1 text-xs font-bold text-[#8D775F]">
                        <MapPin size={12} />
                        {food.region}
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm font-bold text-[#6B8E8E] leading-relaxed mt-3 mb-4 pr-12">
                  {food.desc}
                </p>

                <button
                  onClick={() => toggleEaten(food.id)}
                  className={cn(
                    "w-full py-2.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95",
                    isEaten 
                      ? "bg-white text-[#8D775F] border-2 border-[#E0E5D5]" 
                      : "bg-[#FFF3E0] text-[#E65100] border-2 border-[#FFCC80] shadow-sm"
                  )}
                >
                  <CheckCircle2 size={18} />
                  {isEaten ? '取消打卡' : '打卡！我吃過了'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
