import React from 'react';
import { Map, ZoomIn } from 'lucide-react';

export function TransitMaps() {
  return (
    <div className="space-y-4 pb-8">
      <div className="bg-white p-5 rounded-[2rem] border-2 border-[#E0E5D5] shadow-soft">
        <h2 className="text-xl font-black text-[#4A5D5D] mb-1 flex items-center gap-2">
          <Map className="text-[#8FB7D3]" />
          離線交通路線圖 🚃
        </h2>
        <p className="text-xs font-bold text-[#8D775F] opacity-80 mb-4">
          點擊圖片可放大查看。請記得將實際的地圖圖片放入資料夾中喔！
        </p>

        <div className="space-y-6">
          {/* JR 四國 */}
          <div className="space-y-2">
            <h3 className="font-black text-[#5A7D9A] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#5A7D9A]" />
              JR 四國路線圖
            </h3>
            <div className="relative rounded-2xl border-2 border-[#E0E5D5] overflow-hidden bg-[#F7F4EB] aspect-video flex items-center justify-center group cursor-pointer active:scale-95 transition-transform">
              <img 
                src="./jr-map.jpg" 
                alt="JR 四國路線圖" 
                className="w-full h-full object-cover opacity-60" 
                onError={(e) => { 
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop'; 
                }} 
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-black/10">
                <ZoomIn className="text-white mb-2 drop-shadow-md" size={32} />
                <span className="text-sm font-bold text-[#4A5D5D] bg-white/90 px-3 py-1 rounded-lg shadow-sm">
                  請替換 jr-map.jpg
                </span>
              </div>
            </div>
          </div>

          {/* 琴電 */}
          <div className="space-y-2">
            <h3 className="font-black text-[#E65100] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E65100]" />
              高松琴平電鐵 (琴電)
            </h3>
            <div className="relative rounded-2xl border-2 border-[#E0E5D5] overflow-hidden bg-[#F7F4EB] aspect-video flex items-center justify-center group cursor-pointer active:scale-95 transition-transform">
              <img 
                src="./kotoden-map.jpg" 
                alt="琴電路線圖" 
                className="w-full h-full object-cover opacity-60" 
                onError={(e) => { 
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=800&auto=format&fit=crop'; 
                }} 
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-black/10">
                <ZoomIn className="text-white mb-2 drop-shadow-md" size={32} />
                <span className="text-sm font-bold text-[#4A5D5D] bg-white/90 px-3 py-1 rounded-lg shadow-sm">
                  請替換 kotoden-map.jpg
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
