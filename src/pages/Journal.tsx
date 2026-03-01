import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, MessageCircle, Heart, Plus, Image as ImageIcon, X, Send, Trash2, Share2 } from 'lucide-react';
import { cn } from '../lib/utils';
import exifr from 'exifr';

// 模擬當前使用者
const CURRENT_USER = { name: '阿倫', emoji: '🐶', bgColor: 'bg-[#E8F3E8]' };

interface Comment {
  id: string;
  author: string;
  emoji: string;
  text: string;
  createdAt: number;
}

interface JournalEntry {
  id: string;
  imageUrl?: string;
  text: string;
  location: string;
  time: string;
  mood: string;
  weather: string;
  author: { name: string; emoji: string; bgColor: string };
  comments: Comment[];
  rotation: number;
  tapeColor: string;
  tapeRotation: number;
  createdAt: number;
}

const MOODS = ['😊', '😋', '🥰', '😎', '😫', '🥺'];
const WEATHERS = ['☀️', '⛅', '🌧️', '❄️', '💨'];
const TAPE_COLORS = ['bg-[#FFB3B3]/70', 'bg-[#B3D9FF]/70', 'bg-[#FFE6B3]/70', 'bg-[#B3FFB3]/70'];

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isComposing, setIsComposing] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 表單狀態
  const [newText, setNewText] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newMood, setNewMood] = useState('😊');
  const [newWeather, setNewWeather] = useState('☀️');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // 1. 載入本地數據
  useEffect(() => {
    const saved = localStorage.getItem('shikoku_journals');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setEntries(parsed);
      } catch (e) {
        console.error('Failed to parse journals', e);
      }
    }
  }, []);

  // 儲存到本地
  const saveEntries = (newEntries: JournalEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem('shikoku_journals', JSON.stringify(newEntries));
  };

  // 取得當前時間
  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  // 初始化表單
  const initForm = () => {
    setNewText('');
    setNewLocation('');
    setNewTime(getCurrentTime());
    setNewMood('😊');
    setNewWeather('☀️');
    setPreviewImage(null);
  };

  // 處理圖片選擇與 EXIF 讀取 + Canvas 壓縮
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);

    try {
      // 1. 讀取 EXIF 資訊
      const exifData = await exifr.parse(file);
      
      if (exifData) {
        if (exifData.DateTimeOriginal || exifData.DateTime) {
          const dateObj = exifData.DateTimeOriginal || exifData.DateTime;
          if (dateObj instanceof Date) {
            const hours = dateObj.getHours().toString().padStart(2, '0');
            const minutes = dateObj.getMinutes().toString().padStart(2, '0');
            setNewTime(`${hours}:${minutes}`);
          }
        }

        if (exifData.latitude && exifData.longitude) {
          const lat = exifData.latitude.toFixed(4);
          const lng = exifData.longitude.toFixed(4);
          setNewLocation(`GPS: ${lat}, ${lng}`);
        }
      }

      // 2. 使用 Canvas 進行圖片壓縮 (省流處理)
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800; // 限制最大寬度為 800px
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
          
          // 壓縮為 JPEG，品質 0.6 (大幅減少檔案大小)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
          setPreviewImage(compressedBase64);
          setIsExtracting(false);
        };
      };
    } catch (error) {
      console.error("Error processing image:", error);
      setIsExtracting(false);
    } finally {
      // 讀取完畢後清空 input，允許重複選擇同一張照片
      e.target.value = '';
    }
  };

  // 提交新日誌
  const handleSubmit = async () => {
    if (!newText.trim() && !previewImage) return;
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const randomRotation = Math.floor(Math.random() * 6) - 3; // -3 to +3 degrees
      const randomTapeColor = TAPE_COLORS[Math.floor(Math.random() * TAPE_COLORS.length)];
      const randomTapeRotation = Math.floor(Math.random() * 10) - 5;

      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        imageUrl: previewImage || undefined,
        text: newText,
        location: newLocation || '秘密景點',
        time: newTime,
        mood: newMood,
        weather: newWeather,
        author: CURRENT_USER,
        comments: [],
        rotation: randomRotation,
        tapeColor: randomTapeColor,
        tapeRotation: randomTapeRotation,
        createdAt: Date.now()
      };

      saveEntries([newEntry, ...entries]);

      setIsComposing(false);
      initForm();
    } catch (error) {
      console.error("Error adding journal entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 刪除日誌
  const handleDeleteEntry = (id: string) => {
    if (window.confirm('確定要撕下這頁手帳嗎？（刪除後無法復原喔！）')) {
      saveEntries(entries.filter(e => e.id !== id));
    }
  };

  // 提交留言
  const handleAddComment = (entryId: string) => {
    if (!commentText.trim()) return;
    
    const newComment = {
      id: Date.now().toString(),
      author: CURRENT_USER.name,
      emoji: CURRENT_USER.emoji,
      text: commentText,
      createdAt: Date.now()
    };

    saveEntries(entries.map(e => {
      if (e.id === entryId) {
        return { ...e, comments: [...(e.comments || []), newComment] };
      }
      return e;
    }));

    setCommentText('');
  };

  // 分享到 LINE / 其他 App
  const handleShare = async (entry: JournalEntry) => {
    const shareText = `【四國旅遊手帳】\n📍 ${entry.location} 🕒 ${entry.time}\n心情：${entry.mood} 天氣：${entry.weather}\n\n${entry.text}\n\n- ${entry.author.name} ${entry.author.emoji}`;
    
    if (navigator.share) {
      try {
        // 如果有圖片，且瀏覽器支援分享檔案 (通常需要 File 物件)
        if (entry.imageUrl && entry.imageUrl.startsWith('data:image')) {
          try {
            const res = await fetch(entry.imageUrl);
            const blob = await res.blob();
            const file = new File([blob], 'journal.jpg', { type: 'image/jpeg' });
            
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              await navigator.share({
                title: '四國旅遊手帳',
                text: shareText,
                files: [file]
              });
              return;
            }
          } catch (e) {
            console.warn('Cannot share file, fallback to text', e);
          }
        }
        
        // 純文字分享
        await navigator.share({
          title: '四國旅遊手帳',
          text: shareText,
        });
      } catch (error) {
        console.error('Error sharing', error);
      }
    } else {
      // Fallback: 複製到剪貼簿
      try {
        await navigator.clipboard.writeText(shareText);
        alert('手帳內容已複製到剪貼簿！您可以直接貼上到 LINE 囉！');
      } catch (err) {
        alert('分享失敗，請手動複製內容。');
      }
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 頂部標題 */}
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-3xl font-rounded font-black text-[#8D775F]">旅行手帳</h2>
          <p className="text-sm font-bold text-[#8FB7D3] mt-1 font-rounded">記錄我們的美好回憶 📸</p>
        </div>
        <button 
          onClick={() => {
            initForm();
            setIsComposing(true);
          }}
          className="w-12 h-12 bg-[#8FB7D3] text-white rounded-full shadow-soft flex items-center justify-center active:scale-95 transition-all"
        >
          <Plus size={24} strokeWidth={3} />
        </button>
      </div>

      {/* 撰寫新日誌 Modal */}
      <AnimatePresence>
        {isComposing && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <div className="bg-[#F7F4EB] w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden border-4 border-white">
              <div className="p-4 bg-white flex justify-between items-center border-b-2 border-[#E0E5D5]">
                <h3 className="font-rounded font-bold text-lg text-[#8D775F]">新增手帳貼文</h3>
                <button onClick={() => setIsComposing(false)} className="p-2 bg-[#F0F0F0] rounded-full text-[#8D775F]">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                {/* 照片上傳與壓縮區 */}
                <label className="block w-full h-48 bg-white rounded-2xl border-2 border-dashed border-[#E0E5D5] flex flex-col items-center justify-center cursor-pointer overflow-hidden relative hover:bg-[#F7F4EB] transition-colors">
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <ImageIcon size={32} className="text-[#8D775F] opacity-50 mb-2" />
                      <span className="font-rounded font-bold text-[#8D775F] opacity-70 text-sm">
                        {isExtracting ? '壓縮與讀取資訊中...' : '點擊上傳照片 (自動壓縮省流)'}
                      </span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={isExtracting || isSubmitting} />
                </label>

                {/* 時空資訊 */}
                <div className="flex gap-2">
                  <div className="flex-1 bg-white px-4 py-2 rounded-xl border-2 border-[#E0E5D5] flex items-center gap-2">
                    <MapPin size={16} className="text-[#E5989B] shrink-0" />
                    <input 
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="輸入地點..."
                      className="w-full bg-transparent outline-none font-rounded text-sm text-[#4A5D5D]"
                    />
                  </div>
                  <div className="bg-white px-4 py-2 rounded-xl border-2 border-[#E0E5D5] flex items-center gap-2">
                    <Clock size={16} className="text-[#6B8E8E] shrink-0" />
                    <input 
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full bg-transparent outline-none font-rounded text-sm text-[#4A5D5D]"
                    />
                  </div>
                </div>

                {/* 心情與天氣 */}
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="text-xs font-bold text-[#8D775F]">心情</label>
                    <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2 px-1">
                      {MOODS.map(m => (
                        <button key={m} onClick={() => setNewMood(m)} className={cn("text-2xl transition-transform shrink-0", newMood === m ? "scale-125" : "opacity-50 grayscale")}>{m}</button>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="text-xs font-bold text-[#8D775F]">天氣</label>
                    <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2 px-1">
                      {WEATHERS.map(w => (
                        <button key={w} onClick={() => setNewWeather(w)} className={cn("text-2xl transition-transform shrink-0", newWeather === w ? "scale-125" : "opacity-50 grayscale")}>{w}</button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 內容 */}
                <textarea 
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="寫下這刻的回憶吧..."
                  className="w-full h-32 bg-white rounded-2xl border-2 border-[#E0E5D5] p-4 font-handwriting text-lg outline-none resize-none focus:border-[#88B04B]"
                />

                <button 
                  onClick={handleSubmit}
                  disabled={isExtracting || isSubmitting || (!newText.trim() && !previewImage)}
                  className={cn("w-full bg-[#8FB7D3] text-white font-bold py-3 px-6 rounded-xl shadow-soft border-2 border-[#5A7D9A] transition-all duration-200 active:scale-95 active:shadow-soft-active active:translate-y-1 font-rounded text-lg", (isExtracting || isSubmitting || (!newText.trim() && !previewImage)) && "opacity-50 cursor-not-allowed")}
                >
                  {isSubmitting ? '貼上中...' : isExtracting ? '處理中...' : '貼上手帳本！'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 手帳瀑布流 */}
      <div className="space-y-12 px-2">
        {entries.length === 0 && !isComposing && (
          <div className="text-center py-20 opacity-60">
            <p className="font-rounded font-bold text-[#8D775F]">手帳本還是空的喔！<br/>趕快新增第一篇回憶吧！</p>
          </div>
        )}

        {entries.map((entry) => (
          <motion.div 
            key={entry.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ rotate: `${entry.rotation}deg` }}
            className="relative bg-white p-4 pb-12 shadow-[2px_8px_20px_rgba(0,0,0,0.08)] rounded-sm border border-gray-100 mx-2 group"
          >
            {/* 分享按鈕 */}
            <button 
              onClick={() => handleShare(entry)}
              className="absolute top-2 right-12 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#8FB7D3] shadow-sm z-10 border border-[#E3F2FD] active:scale-90 transition-transform"
            >
              <Share2 size={16} />
            </button>

            {/* 刪除按鈕 */}
            <button 
              onClick={() => handleDeleteEntry(entry.id)}
              className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#D97777] shadow-sm z-10 border border-[#FFD6D6] active:scale-90 transition-transform"
            >
              <Trash2 size={16} />
            </button>

            {/* 紙膠帶 */}
            <div 
              className={cn("absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-8 shadow-sm backdrop-blur-sm", entry.tapeColor)}
              style={{ rotate: `${entry.tapeRotation}deg` }}
            />

            {/* 照片 */}
            {entry.imageUrl && (
              <div className="relative rounded-sm overflow-hidden border border-gray-200 bg-gray-50 aspect-square">
                <img src={entry.imageUrl} alt="Journal" className="w-full h-full object-cover" />
              </div>
            )}

            {/* 時空與心情標籤 */}
            <div className={cn("flex justify-between items-center px-1", entry.imageUrl ? "mt-4" : "mt-2 mb-4 border-b-2 border-dashed border-[#E0E5D5] pb-4")}>
              <div className="flex items-center gap-1.5 text-[#8D775F] opacity-80">
                <MapPin size={14} />
                <span className="font-rounded text-xs font-bold">{entry.time} @ {entry.location}</span>
              </div>
              <div className="flex gap-1 text-xl bg-[#F7F4EB] px-2 py-1 rounded-lg border border-[#E0E5D5]">
                {entry.mood} {entry.weather}
              </div>
            </div>

            {/* 手寫文字內容 */}
            <p className={cn("font-handwriting text-[#4A5D5D] leading-relaxed px-2 whitespace-pre-wrap", entry.imageUrl ? "text-xl mt-4" : "text-2xl min-h-[80px]")}>
              {entry.text}
            </p>

            {/* 作者標籤 */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <span className="font-handwriting text-lg text-[#8D775F]">- {entry.author.name}</span>
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 border-white shadow-sm", entry.author.bgColor)}>
                {entry.author.emoji}
              </div>
            </div>

            {/* 留言按鈕 */}
            <button 
              onClick={() => setActiveCommentId(activeCommentId === entry.id ? null : entry.id)}
              className="absolute bottom-4 left-4 flex items-center gap-1.5 text-[#6B8E8E] bg-[#F0F5F5] px-3 py-1.5 rounded-full font-rounded text-xs font-bold active:scale-95 transition-all"
            >
              <MessageCircle size={14} />
              {entry.comments?.length || 0} 則留言
            </button>

            {/* 留言板區塊 (展開) */}
            <AnimatePresence>
              {activeCommentId === entry.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className={cn("overflow-hidden", entry.imageUrl ? "mt-12" : "mt-14")}
                  style={{ rotate: `${-entry.rotation}deg` }} // 抵銷外層的旋轉，讓留言板保持水平
                >
                  <div className="bg-[#F7F4EB] rounded-2xl p-4 border-2 border-[#E0E5D5] space-y-3">
                    <h4 className="font-rounded font-bold text-[#8D775F] text-sm flex items-center gap-2">
                      <MessageCircle size={16} /> 旅伴留言板
                    </h4>
                    
                    <div className="space-y-3 max-h-40 overflow-y-auto scrollbar-hide">
                      {entry.comments?.map(comment => (
                        <div key={comment.id} className="flex gap-2 items-start bg-white p-2.5 rounded-xl border border-[#E0E5D5]">
                          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs shrink-0">
                            {comment.emoji}
                          </div>
                          <div>
                            <span className="font-rounded font-bold text-xs text-[#8D775F] mr-2">{comment.author}</span>
                            <p className="font-handwriting text-sm text-[#4A5D5D] mt-0.5">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                      {(!entry.comments || entry.comments.length === 0) && (
                        <p className="text-center text-xs font-rounded text-[#8D775F] opacity-60 py-2">還沒有人留言喔！</p>
                      )}
                    </div>

                    {/* 新增留言 */}
                    <div className="flex gap-2 mt-2">
                      <input 
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="偷偷說點什麼..."
                        className="flex-1 bg-white rounded-full px-4 py-2 text-sm font-rounded outline-none border border-[#E0E5D5] focus:border-[#88B04B]"
                      />
                      <button 
                        onClick={() => handleAddComment(entry.id)}
                        className="w-9 h-9 bg-[#88B04B] text-white rounded-full flex items-center justify-center shadow-sm active:scale-95"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
