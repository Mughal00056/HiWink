import React, { useState, useEffect } from 'react';
import { X, RefreshCw, CheckCircle2 } from 'lucide-react';
import { AppItem, LanguageCode } from '../../types/app';

interface RequestUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  app: AppItem;
  lang: LanguageCode;
  onSubmitted: (note: string) => void;
}

export const RequestUpdateModal: React.FC<RequestUpdateModalProps> = ({
  isOpen,
  onClose,
  app,
  lang,
  onSubmitted,
}) => {
  const [targetVersion, setTargetVersion] = useState('v3.16.0');
  const [reason, setReason] = useState<'update' | 'broken' | 'arch'>('update');
  const [note, setNote] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSent(false);
      setNote('');
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    onSubmitted(`${app.shortTitle} (${reason}: ${targetVersion})`);
    setTimeout(() => {
      onClose();
    }, 1100);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={lang === 'id' ? 'Minta Pembaruan' : 'Request Update'}
    >
      <div className="bg-white dark:bg-[#0b0d13] border border-slate-200 dark:border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close request modal"
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 p-2 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              {lang === 'id' ? 'Minta Update / Lapor Link' : 'Request Update / Report'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono-tech">
              {app.name} ({app.version})
            </p>
          </div>
        </div>

        {sent ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {lang === 'id' ? 'Permintaan Berhasil Dikirim!' : 'Request Submitted!'}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'id'
                ? 'Tim kurator akan memeriksa versi terbaru segera.'
                : 'Our build team will verify the latest version shortly.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'update', label: lang === 'id' ? 'Versi Baru' : 'New Version' },
                { id: 'broken', label: lang === 'id' ? 'Link Rusak' : 'Broken Link' },
                { id: 'arch', label: lang === 'id' ? 'Build 32-bit' : '32-bit Build' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setReason(opt.id as 'update' | 'broken' | 'arch')}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-mono-tech font-semibold transition-colors cursor-pointer ${
                    reason === opt.id
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-white/[0.04] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono-tech font-semibold text-slate-600 dark:text-slate-300">
                {lang === 'id' ? 'Versi Target' : 'Target Version'}
              </label>
              <input
                type="text"
                value={targetVersion}
                onChange={(e) => setTargetVersion(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-[#050505] border border-slate-200 dark:border-white/10 text-sm font-mono-tech text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono-tech font-semibold text-slate-600 dark:text-slate-300">
                {lang === 'id' ? 'Catatan Tambahan (Opsional)' : 'Additional Note (Optional)'}
              </label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={
                  lang === 'id'
                    ? 'Contoh: Perangkat Android 15 membutuhkan build arm64...'
                    : 'Example: Android 15 device or specific feature request...'
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-[#050505] border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-mono-tech font-bold transition-colors cursor-pointer"
            >
              {lang === 'id' ? 'Kirim Permintaan' : 'Submit Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
