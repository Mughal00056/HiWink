import React, { useEffect } from 'react';
import { X, Settings, Sun, Moon, Globe, Bookmark, Trash2 } from 'lucide-react';
import { AppItem, LanguageCode, ThemeMode } from '../../types/app';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: LanguageCode;
  onSetLang: (lang: LanguageCode) => void;
  theme: ThemeMode;
  onSetTheme: (theme: ThemeMode) => void;
  savedApps: AppItem[];
  onSelectApp: (app: AppItem) => void;
  onClearSaved: () => void;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  lang,
  onSetLang,
  theme,
  onSetTheme,
  savedApps,
  onSelectApp,
  onClearSaved,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={lang === 'id' ? 'Preferensi & Akun' : 'Account & Preferences'}
    >
      <div className="bg-white dark:bg-[#0b0d13] border border-slate-200 dark:border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl relative space-y-5">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preferences modal"
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 p-2 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-500">
            <Settings className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display text-base font-extrabold text-slate-900 dark:text-white">
              {lang === 'id' ? 'Preferensi Portal' : 'Portal Preferences'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono-tech">
              Berry Mod Apeka
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              <Globe className="w-4 h-4 text-blue-500" />
              <span>{lang === 'id' ? 'Bahasa' : 'Language'}</span>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => onSetLang('id')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech font-bold cursor-pointer ${
                  lang === 'id'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Indonesia
              </button>
              <button
                type="button"
                onClick={() => onSetLang('en')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech font-bold cursor-pointer ${
                  lang === 'en'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                English
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-blue-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
              <span>{lang === 'id' ? 'Tema Tampilan' : 'Appearance'}</span>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => onSetTheme('dark')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech font-bold cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Dark
              </button>
              <button
                type="button"
                onClick={() => onSetTheme('light')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech font-bold cursor-pointer ${
                  theme === 'light'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Light
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-tech font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-blue-500" />
              <span>
                {lang === 'id' ? 'Aplikasi Tersimpan' : 'Saved Apps'} ({savedApps.length})
              </span>
            </span>
            {savedApps.length > 0 && (
              <button
                type="button"
                onClick={onClearSaved}
                className="text-xs text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>{lang === 'id' ? 'Hapus' : 'Clear'}</span>
              </button>
            )}
          </div>

          {savedApps.length === 0 ? (
            <div className="text-xs text-slate-500 dark:text-slate-400 py-3 text-center rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
              {lang === 'id' ? 'Belum ada aplikasi tersimpan.' : 'No saved apps yet.'}
            </div>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {savedApps.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectApp(item);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/10 text-left cursor-pointer"
                >
                  <img
                    src={item.iconUrl}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.name}
                    </div>
                    <div className="text-[11px] font-mono-tech text-slate-500 dark:text-slate-400">
                      {item.version} · {item.size}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
