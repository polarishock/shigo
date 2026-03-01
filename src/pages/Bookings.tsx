import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Bed, Car, Ticket, MapPin, Clock, Calendar, FileText, Phone } from 'lucide-react';
import { cn } from '../lib/utils';

// 預訂分類
const CATEGORIES = [
  { id: 'all', label: '全部' },
  { id: 'flight', label: '機票', icon: Plane },
  { id: 'hotel', label: '住宿', icon: Bed },
  { id: 'car', label: '租車', icon: Car },
  { id: 'ticket', label: '票券', icon: Ticket },
];

// 模擬預訂資料
const BOOKINGS = [
  {
    id: '1',
    type: 'flight',
    title: '中華航空 CI178 (去程)',
    subtitle: '經濟艙 / 1件託運行李 (23kg)',
    refNumber: '請輸入代號',
    details: [
      { icon: Clock, label: '出發', value: '2026/09/05 14:30 桃園機場 T2 (TPE)' },
      { icon: MapPin, label: '抵達', value: '2026/09/05 18:05 高松機場 (TAK)' }
    ],
    theme: { bg: 'bg-[#E3F2FD]', text: 'text-[#1565C0]' },
    icon: Plane
  },
  {
    id: '2',
    type: 'flight',
    title: '中華航空 CI179 (回程)',
    subtitle: '經濟艙 / 1件託運行李 (23kg)',
    refNumber: '請輸入代號',
    details: [
      { icon: Clock, label: '出發', value: '2026/09/12 19:05 高松機場 (TAK)' },
      { icon: MapPin, label: '抵達', value: '2026/09/12 20:55 桃園機場 T2 (TPE)' }
    ],
    theme: { bg: 'bg-[#E3F2FD]', text: 'text-[#1565C0]' },
    icon: Plane
  },
  {
    id: '3',
    type: 'hotel',
    title: '東橫INN 丸龜站前店',
    subtitle: '雙人房 / 4晚 (含早餐)',
    refNumber: '請輸入代號',
    details: [
      { icon: Calendar, label: '入住', value: '2026/09/05 16:00 後' },
      { icon: Calendar, label: '退房', value: '2026/09/09 10:00 前' },
      { icon: MapPin, label: '地址', value: '香川縣丸龜市濱町25-1' },
      { icon: MapPin, label: '英文地址', value: '25-1 Hamamachi, Marugame, Kagawa' },
      { icon: Phone, label: '電話', value: '+81-877-21-1045' }
    ],
    theme: { bg: 'bg-[#FFF3E0]', text: 'text-[#E65100]' },
    icon: Bed
  },
  {
    id: '4',
    type: 'hotel',
    title: '高松 JR Hotel Clement',
    subtitle: '雙人房 / 3晚 (含早餐)',
    refNumber: '請輸入代號',
    details: [
      { icon: Calendar, label: '入住', value: '2026/09/09 14:00 後' },
      { icon: Calendar, label: '退房', value: '2026/09/12 12:00 前' },
      { icon: MapPin, label: '地址', value: '香川縣高松市濱之町1-1' },
      { icon: MapPin, label: '英文地址', value: '1-1 Hamanocho, Takamatsu, Kagawa' },
      { icon: Phone, label: '電話', value: '+81-87-811-1111' }
    ],
    theme: { bg: 'bg-[#FFF3E0]', text: 'text-[#E65100]' },
    icon: Bed
  }
];

export default function Bookings() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredBookings = BOOKINGS.filter(
    (b) => activeTab === 'all' || b.type === activeTab
  );

  return (
    <div className="space-y-6 pb-8">
      {/* 標題與分類標籤 */}
      <div className="sticky top-0 z-20 bg-[#F7F4EB] pt-2 pb-4 -mx-4 px-4">
        <h2 className="text-2xl font-black text-[#8D775F] mb-4">預訂資訊</h2>
        
        <div className="flex overflow-x-auto gap-2 pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {CATEGORIES.map((cat) => {
            const isSelected = activeTab === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={cn(
                  "snap-start shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-sm transition-all duration-300 border-2",
                  isSelected
                    ? "bg-[#8FB7D3] text-white border-[#8FB7D3] shadow-md"
                    : "bg-white text-[#6B8E8E] border-[#E0E5D5] hover:border-[#8FB7D3]/50"
                )}
              >
                {Icon && <Icon size={16} />}
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 預訂卡片列表 */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredBookings.map((booking) => {
            const Icon = booking.icon;
            return (
              <motion.div
                key={booking.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-[2rem] border-2 border-[#E0E5D5] shadow-sm overflow-hidden relative"
              >
                {/* 頂部裝飾條 (瀨戶內海藍) */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-[#8FB7D3]" />
                
                {/* 卡片上半部：標題與圖示 */}
                <div className="p-5 pt-7 flex items-center gap-4 border-b-2 border-dashed border-[#E0E5D5] relative">
                  {/* 左右兩個半圓形切口 (營造票券感) */}
                  <div className="absolute -left-3 -bottom-3 w-6 h-6 bg-[#F7F4EB] rounded-full border-r-2 border-t-2 border-[#E0E5D5] rotate-45" />
                  <div className="absolute -right-3 -bottom-3 w-6 h-6 bg-[#F7F4EB] rounded-full border-l-2 border-t-2 border-[#E0E5D5] -rotate-45" />
                  
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0", booking.theme.bg, booking.theme.text)}>
                    <Icon size={28} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-[#4A5D5D] text-lg truncate">{booking.title}</h3>
                    <p className="text-xs font-bold text-[#8D775F] truncate">{booking.subtitle}</p>
                  </div>
                </div>

                {/* 卡片下半部：詳細資訊 */}
                <div className="p-5 bg-gradient-to-b from-white to-[#F7F4EB]/30">
                  <div className="space-y-3">
                    {booking.details.map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#E0E5D5]/50 flex items-center justify-center shrink-0 mt-0.5">
                          <detail.icon size={12} className="text-[#6B8E8E]" />
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-[#8D775F] block mb-0.5">{detail.label}</span>
                          <span className="text-sm font-bold text-[#4A5D5D]">{detail.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredBookings.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-4xl mb-3 opacity-50">🎫</div>
            <p className="text-[#8D775F] font-bold">目前沒有相關的預訂資訊喔！</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
