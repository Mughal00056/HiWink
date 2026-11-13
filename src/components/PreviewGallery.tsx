import React, { useRef, useState, useEffect } from 'react';
import { Images, ArrowLeft, ArrowRight, Maximize2 } from 'lucide-react';
import { LanguageCode, PreviewScreenshot } from '../types/app';
import { TRANSLATIONS } from '../data/translations';

interface PreviewGalleryProps {
  screenshots: PreviewScreenshot[];
  lang: LanguageCode;
  onOpenPreview: (index: number) => void;
}

export const PreviewGallery: React.FC<PreviewGalleryProps> = ({
  screenshots,
  lang,
  onOpenPreview,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const t = TRANSLATIONS[lang];

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 12);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 12);
  };

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener('resize', updateScrollButtons);
    return () => window.removeEventListener('resize', updateScrollButtons);
  }, [screenshots]);

  const slideGallery = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const distance = direction === 'left' ? -280 : 280;
    el.scrollBy({ left: distance, behavior: 'smooth' });
  };

  if (!screenshots.length) return null;

  return (
    <section className="py-6 sm:py-8 border-b border-slate-200 dark:border-white/10">
      <h2 className="font-display text-xl sm:text-2xl font-extrabold mb-5 text-slate-900 dark:text-white flex items-center gap-2.5">
        <Images className="w-6 h-6 text-blue-500 shrink-0" />
        <span>{t.appDetail.appPreviews}</span>
      </h2>

      <div className="relative group/gallery">
        <div
          ref={scrollRef}
          onScroll={updateScrollButtons}
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide scroll-smooth snap-x snap-mandatory"
        >
          {screenshots.map((shot, idx) => (
            <button
              key={shot.id}
              type="button"
              onClick={() => onOpenPreview(idx)}
              className="group relative flex-shrink-0 w-44 sm:w-52 aspect-[9/16] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-900 snap-start cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-left"
            >
              <img
                src={shot.src}
                alt={shot.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <div className="text-xs font-bold text-white leading-snug">
                  {shot.title}
                </div>
                <div className="text-[11px] text-slate-300 line-clamp-2 mt-0.5 leading-snug">
                  {shot.caption[lang]}
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => slideGallery('left')}
          aria-label="Previous screenshot"
          className={`hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#131926]/90 hover:bg-blue-600 border border-white/20 text-white items-center justify-center transition-all shadow-xl cursor-pointer ${
            canScrollLeft ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => slideGallery('right')}
          aria-label="Next screenshot"
          className={`hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#131926]/90 hover:bg-blue-600 border border-white/20 text-white items-center justify-center transition-all shadow-xl cursor-pointer ${
            canScrollRight ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
