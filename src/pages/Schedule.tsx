import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { Plane, Train, Utensils, MapPin, Bed, ShoppingBag, Camera, Ticket, Car, Ship, Bus } from 'lucide-react';

// 模擬行程資料
const TRIP_START_DATE = new Date('2026-09-05T00:00:00');

const SCHEDULE_DATA: Record<string, any[]> = {
  '2026-09-05': [
    { id: '1', time: '11:00', title: '家裡出發', location: '桃園機場', type: 'transport', icon: Car, color: 'bg-[#F4A261]', notes: '預計 11:30 抵達' },
    { id: '2', time: '14:30', title: '搭乘航班前往高松', location: '桃園機場(第二航廈) -> 高松機場', type: 'flight', icon: Plane, color: 'bg-[#7FB3D5]', notes: '18:05 抵達高松機場' },
    { id: '3', time: '19:05', title: '丸龜‧機場利木津巴士', location: '高松機場 -> 丸龜車站', type: 'transport', icon: Train, color: 'bg-[#E76F51]', notes: '20:18 抵達丸龜車站' },
    { id: '4', time: '20:30', title: '飯店 Check-in', location: '東橫INN丸龜站前店', type: 'hotel', icon: Bed, color: 'bg-[#2A9D8F]' },
    { id: '5', time: '20:45', title: '晚餐：骨付鳥 一鶴 丸龜本店', location: '骨付鳥 一鶴 丸龜本店', type: 'food', icon: Utensils, color: 'bg-[#E9C46A]', notes: '營業至 22:00' },
  ],
  '2026-09-06': [
    { id: '1', time: '06:30', title: '東橫INN早餐', location: '東橫INN丸龜站前店', type: 'food', icon: Utensils, color: 'bg-[#E9C46A]', notes: '供應時間 06:30-09:00' },
    { id: '2', time: '09:30', title: '搭乘 JR 前往多度津', location: '丸龜車站 -> 多度津車站', type: 'transport', icon: Train, color: 'bg-[#E76F51]', notes: '車程約 5 分鐘' },
    { id: '3', time: '10:18', title: '四國真中千禧年物語', location: '多度津車站', type: 'train', icon: Train, color: 'bg-[#E76F51]', notes: '觀光列車，車程約 2.5 小時' },
    { id: '4', time: '12:00', title: '午餐：觀光列車附餐', type: 'food', icon: Utensils, color: 'bg-[#E9C46A]' },
    { id: '5', time: '13:30', title: '大步危峽谷觀光遊覽船', location: '大步危峽', type: 'spot', icon: Camera, color: 'bg-[#2A9D8F]', notes: '遊覽時間約 30 分鐘' },
    { id: '6', time: '15:00', title: '祖谷藤蔓橋', location: '祖谷蔓橋', type: 'spot', icon: MapPin, color: 'bg-[#2A9D8F]', notes: '停留約 30 分鐘' },
    { id: '7', time: '15:45', title: '琵琶瀑布', location: '琵琶の滝', type: 'spot', icon: MapPin, color: 'bg-[#2A9D8F]', notes: '停留約 15 分鐘' },
    { id: '8', time: '18:00', title: '搭乘 JR 返回丸龜', location: '多度津車站 -> 丸龜車站', type: 'transport', icon: Train, color: 'bg-[#E76F51]', notes: '車程約 5 分鐘' },
    { id: '9', time: '18:30', title: '晚餐：東橫INN', location: '東橫INN丸龜站前店', type: 'food', icon: Utensils, color: 'bg-[#E9C46A]' },
  ],
  '2026-09-07': [
    { id: '1', time: '07:30', title: '東橫INN早餐', location: '東橫INN丸龜站前店', type: 'food', icon: Utensils, color: 'bg-[#E9C46A]' },
    { id: '2', time: '08:30', title: '搭乘 JR 土讚線特急', location: '丸龜車站 -> 琴平車站', type: 'transport', icon: Train, color: 'bg-[#E76F51]' },
    { id: '3', time: '09:00', title: '走路到表參道口', location: '琴平車站 -> 金刀比羅宮表參道', type: 'transport', icon: MapPin, color: 'bg-[#F4A261]' },
    { id: '4', time: '09:30', title: '金刀比羅宮 (御本宮-奧社)', location: '金刀比羅宮', type: 'spot', icon: Camera, color: 'bg-[#2A9D8F]', notes: '挑戰 1368 階梯！' },
    { id: '5', time: '12:30', title: '午餐', location: '琴平表參道周邊', type: 'food', icon: Utensils, color: 'bg-[#E9C46A]' },
    { id: '6', time: '14:00', title: '搭乘 JR 往「詫間站」', location: '琴平車站 -> 詫間車站', type: 'transport', icon: Train, color: 'bg-[#E76F51]' },
    { id: '7', time: '15:00', title: '轉乘三豐市社區巴士', location: '詫間車站 -> 父母濱', type: 'transport', icon: Bus, color: 'bg-[#F4A261]' },
    { id: '8', time: '16:00', title: '父母濱 (天空之鏡)', location: '父母濱', type: 'spot', icon: Camera, color: 'bg-[#2A9D8F]', notes: '欣賞絕美夕陽與天空之鏡' },
  ],
  '2026-09-09': [
    { id: '1', time: '07:30', title: '東橫INN早餐', location: '東橫INN丸龜站前店', type: 'food', icon: Utensils, color: 'bg-[#E9C46A]' },
    { id: '2', time: '09:00', title: '搭乘 JR 前往高松', location: '丸龜車站 -> 高松車站', type: 'transport', icon: Train, color: 'bg-[#E76F51]' },
    { id: '3', time: '09:45', title: '寄放行李', location: 'JR Hotel Clement Takamatsu', type: 'hotel', icon: Bed, color: 'bg-[#2A9D8F]' },
    { id: '4', time: '10:15', title: '搭乘 JR 前往栗林公園北口', location: '高松車站 -> 栗林公園北口站', type: 'transport', icon: Train, color: 'bg-[#E76F51]' },
    { id: '5', time: '10:30', title: '栗林公園', location: '栗林公園', type: 'spot', icon: Camera, color: 'bg-[#2A9D8F]' },
    { id: '6', time: '11:30', title: '南湖周遊「千秋丸」乘船', location: '栗林公園 南湖', type: 'spot', icon: Ticket, color: 'bg-[#2A9D8F]' },
    { id: '7', time: '12:30', title: '午餐：讚岐烏龍麵 上原屋本店', location: '上原屋本店', type: 'food', icon: Utensils, color: 'bg-[#E9C46A]' },
    { id: '8', time: '14:00', title: '高松商店街', location: '高松中央商店街', type: 'spot', icon: ShoppingBag, color: 'bg-[#F4A261]' },
    { id: '9', time: '18:00', title: '晚餐', type: 'food', icon: Utensils, color: 'bg-[#E9C46A]' },
    { id: '10', time: '20:00', title: '飯店 Check-in', location: 'JR Hotel Clement Takamatsu', type: 'hotel', icon: Bed, color: 'bg-[#2A9D8F]' },
  ],
  '2026-09-10': [
    { id: '1', time: '08:00', title: '早餐', type: 'food', icon: Utensils, color: 'bg-[#E9C46A]' },
    { id: '2', time: '09:00', title: '渡輪：高松開 ➔ 抵達土庄港', location: '高松港 -> 土庄港', type: 'transport', icon: Ship, color: 'bg-[#7FB3D5]' },
    { id: '3', time: '10:00', title: '租車 ORIX 租車 (小豆島店)', location: 'ORIX 租車 小豆島店', type: 'transport', icon: Car, color: 'bg-[#F4A261]' },
    { id: '4', time: '10:30', title: '寒霞溪 (搭乘纜車)', location: '寒霞溪', type: 'spot', icon: Camera, color: 'bg-[#2A9D8F]' },
    { id: '5', time: '12:30', title: '二十四之瞳電影村', location: '二十四之瞳電影村', type: 'spot', icon: Camera, color: 'bg-[#2A9D8F]' },
    { id: '6', time: '14:00', title: '丸金醬油紀念館', location: '丸金醬油紀念館', type: 'spot', icon: Camera, color: 'bg-[#2A9D8F]' },
    { id: '7', time: '15:00', title: '小豆島拉麵 HISHIO', location: '小豆島拉麵 HISHIO', type: 'food', icon: Utensils, color: 'bg-[#E9C46A]' },
    { id: '8', time: '16:00', title: '小豆島橄欖公園', location: '小豆島橄欖公園', type: 'spot', icon: Camera, color: 'bg-[#2A9D8F]' },
    { id: '9', time: '17:00', title: '天使之路', location: '天使之路', type: 'spot', icon: MapPin, color: 'bg-[#2A9D8F]' },
    { id: '10', time: '18:30', title: '渡輪：土庄港開 ➔ 返回高松', location: '土庄港 -> 高松港', type: 'transport', icon: Ship, color: 'bg-[#7FB3D5]' },
    { id: '11', time: '20:00', title: '晚餐', type: 'food', icon: Utensils, color: 'bg-[#E9C46A]' },
  ],
  '2026-09-11': [
    { id: '1', time: '07:30', title: '早餐', type: 'food', icon: Utensils, color: 'bg-[#E9C46A]' },
    { id: '2', time: '08:30', title: '搭乘 JR (高松 ➔ 德島 ➔ 鳴門)', location: 'JR 高松站 -> JR 德島站 -> JR 鳴門站', type: 'transport', icon: Train, color: 'bg-[#E76F51]' },
    { id: '3', time: '10:30', title: '搭乘巴士前往「鳴門公園」', location: 'JR 鳴門站 -> 鳴門公園', type: 'transport', icon: Bus, color: 'bg-[#F4A261]', notes: '搭乘「鳴門市營巴士」或「德島巴士」' },
    { id: '4', time: '11:00', title: '鳴門觀光汽船', location: '鳴門觀光汽船', type: 'spot', icon: Ship, color: 'bg-[#7FB3D5]' },
    { id: '5', time: '12:30', title: '午餐：鯛魚茶泡飯.鳴門烏龍麵 潮風', location: '潮風', type: 'food', icon: Utensils, color: 'bg-[#E9C46A]' },
    { id: '6', time: '14:00', title: '搭乘巴士前往 JR 鳴門站', location: '鳴門公園 -> JR 鳴門站', type: 'transport', icon: Bus, color: 'bg-[#F4A261]', notes: '搭乘「鳴門市營巴士」或「德島巴士」' },
    { id: '7', time: '14:30', title: '搭乘 JR (鳴門 ➔ 德島 ➔ 高松)', location: 'JR 鳴門站 -> JR 德島站 -> JR 高松站', type: 'transport', icon: Train, color: 'bg-[#E76F51]' },
    { id: '8', time: '18:00', title: '晚餐', type: 'food', icon: Utensils, color: 'bg-[#E9C46A]' },
  ],
  '2026-09-12': [
    { id: '3', time: '19:05', title: '搭乘中華航空 CI179', location: '高松機場 (TAK) -> 桃園機場 T2 (TPE)', type: 'flight', icon: Plane, color: 'bg-[#7FB3D5]' },
    { id: '4', time: '20:55', title: '抵達台灣', location: '桃園機場 T2', type: 'spot', icon: MapPin, color: 'bg-[#2A9D8F]' },
  ],
};

const HOURLY_WEATHER = [
  { time: '現在', icon: '☀️', temp: 20, pop: '0%' },
  { time: '10:00', icon: '☀️', temp: 21, pop: '0%' },
  { time: '11:00', icon: '⛅', temp: 22, pop: '10%' },
  { time: '12:00', icon: '⛅', temp: 23, pop: '10%' },
  { time: '13:00', icon: '☁️', temp: 23, pop: '20%' },
  { time: '14:00', icon: '☁️', temp: 22, pop: '20%' },
  { time: '15:00', icon: '🌧️', temp: 20, pop: '50%' },
  { time: '16:00', icon: '🌧️', temp: 19, pop: '60%' },
  { time: '17:00', icon: '🌧️', temp: 18, pop: '60%' },
  { time: '18:00', icon: '☁️', temp: 17, pop: '30%' },
];

const TRIP_DATES = [
  { id: '2026-09-05', day: 'Day 1', date: '9/5', weekday: '六' },
  { id: '2026-09-06', day: 'Day 2', date: '9/6', weekday: '日' },
  { id: '2026-09-07', day: 'Day 3', date: '9/7', weekday: '一' },
  { id: '2026-09-08', day: 'Day 4', date: '9/8', weekday: '二' },
  { id: '2026-09-09', day: 'Day 5', date: '9/9', weekday: '三' },
  { id: '2026-09-10', day: 'Day 6', date: '9/10', weekday: '四' },
  { id: '2026-09-11', day: 'Day 7', date: '9/11', weekday: '五' },
  { id: '2026-09-12', day: 'Day 8', date: '9/12', weekday: '六' },
];

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState(TRIP_DATES[0].id);

  // 計算倒數天數
  const today = new Date();
  const diffTime = Math.max(0, TRIP_START_DATE.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6 pb-8">
      {/* 1. 倒數計時卡片 */}
      <div className="bg-[#F9E498] p-6 rounded-[2.5rem] border-4 border-white shadow-xl relative overflow-hidden text-center">
        <div className="absolute -left-4 -top-4 text-6xl opacity-20">✈️</div>
        <div className="absolute -right-4 -bottom-4 text-6xl opacity-20">🏝️</div>
        <h2 className="text-sm font-black text-[#8D775F] mb-1 relative z-10">距離四國之旅出發還有</h2>
        <div className="text-5xl font-black text-[#4A5D5D] relative z-10">
          {diffDays} <span className="text-2xl">天</span>
        </div>
      </div>
      
      {/* 2. 日期選擇器 (橫向捲動) */}
      <div>
        <div className="flex overflow-x-auto gap-3 pt-2 pb-4 snap-x snap-mandatory px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {TRIP_DATES.map((d) => {
            const isSelected = selectedDate === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setSelectedDate(d.id)}
                className={cn(
                  "snap-center shrink-0 flex flex-col items-center justify-start w-[4.5rem] min-h-[5.5rem] py-3 rounded-[1.5rem] border-2 transition-all duration-300 relative overflow-hidden",
                  isSelected 
                    ? "border-[#5A7D9A] shadow-md scale-105" 
                    : "bg-white border-[#E0E5D5] hover:border-[#8FB7D3] hover:bg-[#F7F4EB]"
                )}
              >
                {/* 選擇時的背景動畫 */}
                {isSelected && (
                  <motion.div 
                    layoutId="activeDate"
                    className="absolute inset-0 bg-[#8FB7D3]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                {/* 內容 */}
                <div className="relative z-10 flex flex-col items-center w-full px-2">
                  <span className={cn("text-xs font-black mb-1 transition-colors", isSelected ? "text-[#E0E5D5]" : "text-[#8D775F]")}>
                    {d.day}
                  </span>
                  <span className={cn("text-xl font-black transition-colors", isSelected ? "text-white" : "text-[#4A5D5D]")}>
                    {d.date}
                  </span>
                  <span className={cn(
                    "text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full transition-colors", 
                    isSelected ? "bg-white/20 text-white" : "bg-[#F7F4EB] text-[#8FB7D3]"
                  )}>
                    {d.weekday}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 獨立天氣資訊欄位 (每小時預報) */}
      <div className="bg-white p-4 rounded-3xl border-2 border-[#E0E5D5] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-[#8D775F] flex items-center gap-1.5 text-sm">
            <span className="text-base">🌤️</span>
            每小時天氣預報
          </h3>
          <span className="text-[10px] font-bold text-[#8FB7D3] bg-[#E3F2FD] px-2 py-0.5 rounded-md">高松市</span>
        </div>
        
        <div className="flex overflow-x-auto gap-2 pb-1 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {HOURLY_WEATHER.map((w, i) => (
            <div key={i} className="snap-center shrink-0 flex flex-col items-center justify-center w-14 py-2 bg-[#F7F4EB] rounded-2xl border border-[#E0E5D5]">
              <span className="text-[10px] font-bold text-[#8D775F] mb-1">{w.time}</span>
              <span className="text-xl mb-1">{w.icon}</span>
              <span className="text-xs font-black text-[#4A5D5D] mb-0.5">{w.temp}°</span>
              <span className="text-[9px] font-bold text-[#039BE5]">{w.pop}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. 行程內容區塊 (預留時間軸) */}
      <div className="bg-white p-6 rounded-[2rem] border-2 border-[#E0E5D5] shadow-soft min-h-[300px]">
        <h3 className="font-black text-[#8D775F] mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#88B04B]" />
          {TRIP_DATES.find(d => d.id === selectedDate)?.day} 行程總覽
        </h3>
        
        <div className="relative">
          {/* 垂直時間軸線 */}
          <div className="absolute left-[3.25rem] top-4 bottom-4 w-0.5 bg-[#E0E5D5] rounded-full" />

          <div className="flex flex-col gap-6 relative z-10">
            {(SCHEDULE_DATA[selectedDate] || []).map((item) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={item.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-4 items-start"
                >
                  {/* 時間 */}
                  <div className="w-10 pt-3 text-right shrink-0">
                    <span className="text-sm font-black text-[#8D775F]">{item.time}</span>
                  </div>

                  {/* 圓形圖示標記 */}
                  <div className="relative flex flex-col items-center justify-start pt-2 shrink-0">
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm border-2 border-white z-10", item.color)}>
                      <Icon size={14} strokeWidth={3} />
                    </div>
                  </div>

                  {/* 行程內容卡片 */}
                  <div className="flex-1 bg-[#F7F4EB] rounded-2xl p-4 shadow-sm border border-[#E0E5D5]">
                    <h4 className="text-base font-bold text-[#4A5D5D] mb-1">{item.title}</h4>
                    {item.location && (
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-xs text-[#8FB7D3] font-medium gap-1 hover:text-[#5A7D9A] transition-colors"
                      >
                        <MapPin size={12} />
                        <span className="underline underline-offset-2">{item.location}</span>
                      </a>
                    )}
                    {item.notes && (
                      <div className="mt-2 bg-white/60 px-3 py-2 rounded-xl border border-white">
                        <p className="text-xs font-bold text-[#8FB7D3]">💡 {item.notes}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
