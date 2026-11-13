import React from 'react';
import {
  Home,
  LayoutGrid,
  Gamepad2,
  Video,
  Sparkles,
  Bookmark,
  Settings,
  X,
} from 'lucide-react';
import { LanguageCode } from '../types/app';
import { TRANSLATIONS } from '../data/translations';

export type NavSection = 'all' | 'apps' | 'games' | 'video-editors' | 'ai-tools' | 'saved';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  savedCount: number;
  lang: LanguageCode;
  onOpenPreferences: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeSection,
  onSelectSection,
  savedCount,
  lang,
  onOpenPreferences,
}) => {
  const t = TRANSLATIONS[lang];

  const navItems: Array<{
    id: NavSection;
    label: string;
    icon: React.ReactNode;
    count?: number;
  }> = [
    { id: 'all', label: t.nav.home, icon: <Home className="w-4 h-4 shrink-0" /> },
    { id: 'apps', label: t.nav.apps, icon: <LayoutGrid className="w-4 h-4 shrink-0" /> },
    { id: 'games', label: t.nav.games, icon: <Gamepad2 className="w-4 h-4 shrink-0" /> },
    { id: 'video-editors', label: t.nav.videoEditors, icon: <Video className="w-4 h-4 shrink-0" /> },
    { id: 'ai-tools', label: t.nav.aiTools, icon: <Sparkles className="w-4 h-4 shrink-0" /> },
    {
      id: 'saved',
      label: t.nav.saved,
      icon: <Bookmark className="w-4 h-4 shrink-0" />,
      count: savedCount,
    },
  ];

  const handleNavClick = (id: NavSection) => {
    onSelectSection(id);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Sidebar Navigation"
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 flex flex-col border-r border-slate-200 dark:border-white/10 bg-white dark:bg-[#07090e] text-slate-900 dark:text-slate-100 transition-transform duration-200 ease-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-14 px-5 border-b border-slate-200 dark:border-white/10 shrink-0">
          <button
            type="button"
            onClick={() => handleNavClick('all')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg cursor-pointer"
          >
            <img
              src="/images/berry_140.webp"
              alt="Berry Mod Apeka"
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-xl object-cover border border-slate-200 dark:border-white/15 shrink-0"
            />
            <span className="font-display text-sm font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0">
              Berry Mod
            </span>
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer min-h-[42px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3 whitespace-nowrap shrink-0">
                  {item.icon}
                  <span>{item.label}</span>
                </span>
                {typeof item.count === 'number' && item.count > 0 && (
                  <span
                    className={`font-mono-tech text-xs font-semibold px-1.5 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-[#0b0e17]/70">
          <button
            type="button"
            onClick={onOpenPreferences}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-xs font-bold transition-all shadow-md shadow-blue-600/25 cursor-pointer whitespace-nowrap"
          >
            <Settings className="w-3.5 h-3.5 shrink-0" />
            <span>{t.nav.preferences}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
