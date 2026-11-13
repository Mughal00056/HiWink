import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Share2, Copy, Check, Download, MessageCircle, Send } from 'lucide-react';
import { AppItem, LanguageCode } from '../../types/app';
import { TRANSLATIONS } from '../../data/translations';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  app: AppItem;
  lang: LanguageCode;
  onNotify: (msg: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  app,
  lang,
  onNotify,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const t = TRANSLATIONS[lang];

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/?app=${encodeURIComponent(app.slug)}`
      : `https://berrymodapk.com/${app.slug}/`;

  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    QRCode.toDataURL(shareUrl, {
      width: 240,
      margin: 2,
      color: {
        dark: '#050814',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (active) setQrDataUrl(url);
      })
      .catch(() => {
        if (active) setQrDataUrl('');
      });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      active = false;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, shareUrl, onClose]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      onNotify(t.appDetail.linkCopied);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      onNotify(shareUrl);
    }
  };

  const handleSaveQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `QR-${app.slug}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onNotify(t.appDetail.qrSaved);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `${app.name} ${app.version} (VIP+ Unlocked) — ${shareUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleTelegram = () => {
    const url = encodeURIComponent(shareUrl);
    const text = encodeURIComponent(`${app.name} ${app.version} (VIP+ Unlocked)`);
    window.open(
      `https://t.me/share/url?url=${url}&text=${text}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={t.appDetail.shareApp}
    >
      <div className="bg-white dark:bg-[#0b0d13] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-7 w-full max-w-md shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close share modal"
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 p-2 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <span className="w-8 h-8 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-500">
            <Share2 className="w-4 h-4" />
          </span>
          <h3 className="font-display text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.appDetail.shareApp}
          </h3>
        </div>

        <div className="bg-slate-100 dark:bg-[#050505] border border-slate-200 dark:border-white/10 rounded-2xl p-3.5 mb-5 flex items-center gap-3.5">
          <img
            src={app.iconUrl}
            alt={app.name}
            referrerPolicy="no-referrer"
            className="w-14 h-14 rounded-2xl border border-slate-200 dark:border-white/10 object-cover shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate">
              {app.name}
            </h4>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono-tech flex items-center gap-1.5 mt-0.5 truncate">
              <span className="text-blue-600 dark:text-blue-400 font-semibold truncate">
                {app.developer}
              </span>
              <span>·</span>
              <span className="truncate">{app.version}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="p-3 bg-white rounded-2xl shadow-lg border border-slate-200 flex items-center justify-center w-48 h-48">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR code for ${app.name}`}
                className="w-44 h-44 object-contain rounded-lg"
              />
            ) : (
              <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            )}
          </div>

          <p className="text-slate-500 dark:text-slate-400 text-center text-xs leading-relaxed max-w-xs">
            {t.appDetail.scanQrHint}
          </p>

          <div className="w-full space-y-1.5">
            <label className="text-[11px] font-mono-tech font-bold text-slate-500 dark:text-slate-400">
              {t.appDetail.shareLink}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-slate-100 dark:bg-[#050505] border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none truncate font-mono-tech select-all"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-xl transition-all active:scale-95 text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? t.appDetail.copied : t.appDetail.copy}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 w-full pt-1">
            <button
              type="button"
              onClick={handleSaveQr}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white rounded-xl transition-all text-xs font-bold active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>{t.appDetail.saveQr}</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl transition-all text-xs font-bold active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <MessageCircle className="w-3.5 h-3.5 shrink-0" />
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleTelegram}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-xl transition-all text-xs font-bold active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Send className="w-3.5 h-3.5 shrink-0" />
              <span>Telegram</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
