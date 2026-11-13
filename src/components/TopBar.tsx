import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Sun, Moon, Globe, X } from 'lucide-react';
import { AppItem, LanguageCode, ThemeMode } from '../types/app';
import { TRANSLATIONS } from '../data/translations';

interface TopBarProps {
  onOpenSidebar: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  apps: AppItem[];
  onSelectApp: (app: AppItem) => void;
  lang: LanguageCode;
  onToggleLang: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenSidebar,
  searchQuery,
  onSearchChange,
  apps,
  onSelectApp,
  lang,
  onToggleLang,
  theme,
  onToggleTheme,
}) => {
  const [focused, setFocused] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const normalized = searchQuery.trim().toLowerCase();
  const filteredResults = normalized
    ? apps.filter(
        (item) =>
          item.name.toLowerCase().includes(normalized) ||
          item.shortTitle.toLowerCase().includes(normalized) ||
          item.packageName.toLowerCase().includes(normalized) ||
          item.developer.toLowerCase().includes(normalized)
      )
    : [];

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#050505]/90 backdrop-blur-md lg:pl-64 transition-colors">
      <div className="max-w-[1240px] mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 sm:gap-8">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            type="button"
            onClick={onOpenSidebar}
            aria-label="Open navigation menu"
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div ref={searchBoxRef} className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setFocused(true)}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setFocused(true);
              }}
              placeholder={t.nav.searchPlaceholder}
              aria-label={t.nav.searchPlaceholder}
              className="w-full h-9 pl-9 pr-8 rounded-xl text-xs sm:text-sm bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {focused && normalized.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b0d13] shadow-2xl overflow-hidden z-50">
                {filteredResults.length === 0 ? (
                  <div className="p-4 text-xs text-slate-500 dark:text-slate-400 text-center">
                    {t.nav.noResults}
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-white/5 max-h-72 overflow-y-auto">
                    {filteredResults.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSelectApp(item);
                          setFocused(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <img
                          src={item.iconUrl}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-white/10 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {item.name}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono-tech truncate">
                            {item.version} · {item.size} · {item.developer}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleLang}
            title="Switch Language (ID / EN)"
            className="h-9 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.04] hover:bg-slate-200/80 dark:hover:bg-white/[0.08] text-xs font-mono-tech font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Globe className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>{lang.toUpperCase()}</span>
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="h-9 w-9 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.04] hover:bg-slate-200/80 dark:hover:bg-white/[0.08] text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
