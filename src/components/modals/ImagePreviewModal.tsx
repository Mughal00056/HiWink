import React, { useEffect, useState } from 'react';
import { X, ArrowLeft, ArrowRight, ZoomIn, ZoomOut } from 'lucide-react';
import { LanguageCode, PreviewScreenshot } from '../../types/app';

interface ImagePreviewModalProps {
  screenshots: PreviewScreenshot[];
  activeIndex: number | null;
  lang: LanguageCode;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  screenshots,
  activeIndex,
  lang,
  onClose,
  onChangeIndex,
}) => {
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    setZoomed(false);
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        onChangeIndex((activeIndex - 1 + screenshots.length) % screenshots.length);
      }
      if (e.key === 'ArrowRight') {
        onChangeIndex((activeIndex + 1) % screenshots.length);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, screenshots.length, onClose, onChangeIndex]);

  if (activeIndex === null || !screenshots[activeIndex]) return null;

  const shot = screenshots[activeIndex];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 select-none"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={shot.title}
    >
      <div
        className="absolute top-4 right-4 flex items-center gap-2 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setZoomed((z) => !z)}
          aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-600 border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          {zoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-600 border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {screenshots.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChangeIndex((activeIndex - 1 + screenshots.length) % screenshots.length);
            }}
            aria-label="Previous image"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#131926]/90 hover:bg-blue-600 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChangeIndex((activeIndex + 1) % screenshots.length);
            }}
            aria-label="Next image"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#131926]/90 hover:bg-blue-600 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-xl"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </>
      )}

      <div
        className="max-w-full max-h-[82vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={shot.src}
          alt={shot.title}
          referrerPolicy="no-referrer"
          onClick={() => setZoomed((z) => !z)}
          className={`max-h-[75vh] w-auto object-contain rounded-2xl border border-white/15 shadow-2xl transition-transform duration-200 cursor-pointer ${
            zoomed ? 'scale-125' : 'scale-100'
          }`}
        />
        <div className="mt-4 text-center max-w-md px-4">
          <div className="text-sm font-bold text-white">
            {shot.title} · {activeIndex + 1}/{screenshots.length}
          </div>
          <div className="text-xs text-slate-300 mt-1">{shot.caption[lang]}</div>
        </div>
      </div>
    </div>
  );
};
