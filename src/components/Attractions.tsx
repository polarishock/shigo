import React, { useState } from 'react';
import { Landmark, Clock, Ticket, AlertCircle, Sparkles, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from '@google/genai';
import { cn } from '../lib/utils';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const ATTRACTIONS = [
  {
    name: '金刀比羅宮',
    tag: '必去參拜',
    color: 'bg-[#FFF3E0]',
    textColor: 'text-[#E65100]',
    hours: '06:00 - 18:00 (御本宮)',
    price: '免費 (寶物館另計 ¥800)',
    lastEntry: '建議下午 15:30 前開始爬',
    note: '到本宮需爬 785 階，到奧社共 1368 階。請穿好走的鞋子，並預留 2-3 小時停留時間。'
  },
  {
    name: '父母濱 (天空之鏡)',
    tag: '網美打卡',
    color: 'bg-[#E3F2FD]',
    textColor: 'text-[#5A7D9A]',
    hours: '24 小時開放',
    price: '免費',
    lastEntry: '日落前 30 分鐘抵達最佳',
    note: '需配合「退潮」與「日落」時間重疊才能拍出天空之鏡。建議帶毛巾擦腳。'
  },
  {
    name: '栗林公園',
    tag: '米其林三星庭園',
    color: 'bg-[#E8F3E8]',
    textColor: 'text-[#4A5D5D]',
    hours: '06:30 - 17:00 (依季節變動)',
    price: '大人 ¥410 / 中小學生 ¥170',
    lastEntry: '閉園前 30 分鐘',
    note: '佔地極廣，建議停留 1.5-2 小時。南湖可搭乘日式遊船 (需另付費 ¥620，建議提早預約)。'
  }
];

export function Attractions() {
  const [selectedAttraction, setSelectedAttraction] = useState<string | null>(null);
  const [guideContent, setGuideContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchGuide = async (attractionName: string) => {
    setSelectedAttraction(attractionName);
    setGuideContent('');
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `你是一個專業的日本四國旅遊導遊。請為遊客介紹「${attractionName}」。
請包含以下內容：
1. 歷史背景與簡介
2. 必看特色
3. 實用旅遊建議

請用繁體中文回答，語氣熱情專業，排版清晰易讀，適合在手機上閱讀，可以適度使用 emoji。`,
      });

      if (response.text) {
        setGuideContent(response.text);
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setGuideContent('抱歉，我現在連不上網路，或是遇到了一些問題。請稍後再試！');
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedAttraction(null);
    setGuideContent('');
  };

  return (
    <div className="space-y-4 pb-8">
      <div className="bg-white p-5 rounded-[2rem] border-2 border-[#E0E5D5] shadow-soft">
        <h2 className="text-xl font-black text-[#4A5D5D] mb-4 flex items-center gap-2">
          <Landmark className="text-[#D97777]" />
          景點資訊懶人包 🎫
        </h2>

        <div className="space-y-4">
          {ATTRACTIONS.map((attr, idx) => (
            <div key={idx} className="border-2 border-[#E0E5D5] rounded-2xl overflow-hidden bg-[#F7F4EB] p-4 relative">
              <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl font-black text-xs ${attr.color} ${attr.textColor}`}>
                {attr.tag}
              </div>
              <h3 className="text-lg font-black text-[#4A5D5D] mb-4 pr-16">{attr.name}</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Clock size={16} className="text-[#8D775F] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[#8D775F]">營業時間</p>
                    <p className="text-sm font-black text-[#4A5D5D]">{attr.hours}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Ticket size={16} className="text-[#8D775F] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[#8D775F]">門票價格</p>
                    <p className="text-sm font-black text-[#4A5D5D]">{attr.price}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <AlertCircle size={16} className="text-[#D97777] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[#D97777]">最後入場 / 最佳時間</p>
                    <p className="text-sm font-black text-[#D97777]">{attr.lastEntry}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E0E5D5]/50">
                <p className="text-xs font-bold text-[#6B8E8E] leading-relaxed mb-4">
                  💡 {attr.note}
                </p>
                <button
                  onClick={() => fetchGuide(attr.name)}
                  className="w-full py-2.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 bg-gradient-to-r from-[#8FB7D3] to-[#7FB3D5] text-white shadow-sm border border-[#5A7D9A]/20"
                >
                  <Sparkles size={16} className="animate-pulse" />
                  Gemini 導遊
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gemini Guide Modal */}
      <AnimatePresence>
        {selectedAttraction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-md max-h-[85vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col border-4 border-[#F7F4EB]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-[#F7F4EB] p-4 flex items-center justify-between border-b-2 border-[#E0E5D5]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-[#8FB7D3]">
                    <Sparkles size={16} />
                  </div>
                  <h3 className="font-black text-[#4A5D5D]">{selectedAttraction} 導覽</h3>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#8D775F] hover:bg-[#E0E5D5] transition-colors shadow-sm"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto flex-1">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-48 space-y-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="text-[#8FB7D3]"
                    >
                      <Loader2 size={40} />
                    </motion.div>
                    <p className="text-sm font-bold text-[#8D775F] animate-pulse">
                      Gemini 正在為您整理導覽資訊...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 text-[#4A5D5D] text-sm leading-relaxed font-medium">
                    {guideContent.split('\n').map((line, i) => {
                      if (line.trim() === '') return <br key={i} />;
                      // Simple markdown-like rendering for bold text
                      const formattedLine = line.split(/(\*\*.*?\*\*)/).map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={j} className="font-black text-[#5A7D9A]">{part.slice(2, -2)}</strong>;
                        }
                        return part;
                      });
                      
                      // Check if it's a heading (starts with #)
                      if (line.startsWith('### ')) {
                        return <h4 key={i} className="font-black text-lg text-[#8D775F] mt-4 mb-2">{line.replace('### ', '')}</h4>;
                      } else if (line.startsWith('## ')) {
                        return <h3 key={i} className="font-black text-xl text-[#8D775F] mt-5 mb-2">{line.replace('## ', '')}</h3>;
                      } else if (line.startsWith('# ')) {
                        return <h2 key={i} className="font-black text-2xl text-[#8D775F] mt-6 mb-3">{line.replace('# ', '')}</h2>;
                      }

                      return <p key={i}>{formattedLine}</p>;
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
