import { useState, useEffect, useMemo, useCallback } from 'react';
import { APPS_CATALOG } from './data/appsCatalog';
import { TRANSLATIONS } from './data/translations';
import { AppItem, AppVersion, LanguageCode, ThemeMode, ToastItem } from './types/app';
import { Sidebar, NavSection } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { HeroBanner } from './components/HeroBanner';
import { StatsAndActions } from './components/StatsAndActions';
import { PreviewGallery } from './components/PreviewGallery';
import { AppDescription } from './components/AppDescription';
import { SidebarInfoColumn } from './components/SidebarInfoColumn';
import { RelatedAppsSection } from './components/RelatedAppsSection';
import { VersionsModal } from './components/modals/VersionsModal';
import { ShareModal } from './components/modals/ShareModal';
import { TutorialModal } from './components/modals/TutorialModal';
import { ImagePreviewModal } from './components/modals/ImagePreviewModal';
import { RequestUpdateModal } from './components/modals/RequestUpdateModal';
import { PreferencesModal } from './components/modals/PreferencesModal';
import { FloatingDownloadBar } from './components/FloatingDownloadBar';
import { ToastContainer } from './components/ToastContainer';

export default function App() {
  const [lang, setLang] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('bma_lang');
    return saved === 'en' || saved === 'id' ? saved : 'id';
  });

  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('bma_theme');
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  });

  const [currentApp, setCurrentApp] = useState<AppItem>(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('app')?.toLowerCase();
    return APPS_CATALOG.find((a) => a.slug.toLowerCase() === slug) ?? APPS_CATALOG[0];
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<NavSection>('all');
  const [developerFilter, setDeveloperFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [savedAppIds, setSavedAppIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('bma_saved_apps');
      return raw ? JSON.parse(raw) : ['wink'];
    } catch {
      return ['wink'];
    }
  });

  const [userRatings, setUserRatings] = useState<Record<string, number>>(() => {
    try {
      const raw = localStorage.getItem('bma_user_ratings');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [versionsModalOpen, setVersionsModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [tutorialModalOpen, setTutorialModalOpen] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [preferencesModalOpen, setPreferencesModalOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const [showFloatingBar, setShowFloatingBar] = useState(false);
  const [downloadUnlocked, setDownloadUnlocked] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('bma_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem('bma_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('bma_saved_apps', JSON.stringify(savedAppIds));
  }, [savedAppIds]);

  useEffect(() => {
    localStorage.setItem('bma_user_ratings', JSON.stringify(userRatings));
  }, [userRatings]);

  useEffect(() => {
    setDownloadUnlocked(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentApp.id]);

  useEffect(() => {
    const onScroll = () => {
      setShowFloatingBar(window.scrollY > 360);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastItem['type'] = 'success') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev, { id, message, type }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== id));
      }, 3200);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleSelectApp = useCallback((app: AppItem) => {
    setCurrentApp(app);
    setDeveloperFilter(null);
  }, []);

  const handleToggleSave = useCallback(() => {
    setSavedAppIds((prev) => {
      const exists = prev.includes(currentApp.id);
      const next = exists
        ? prev.filter((id) => id !== currentApp.id)
        : [...prev, currentApp.id];
      addToast(
        exists
          ? lang === 'id'
            ? `${currentApp.shortTitle} dihapus dari tersimpan`
            : `${currentApp.shortTitle} removed from saved`
          : lang === 'id'
          ? `${currentApp.shortTitle} disimpan`
          : `${currentApp.shortTitle} saved to bookmarks`,
        'info'
      );
      return next;
    });
  }, [currentApp.id, currentApp.shortTitle, lang, addToast]);

  const handleRate = useCallback(
    (stars: number) => {
      setUserRatings((prev) => ({ ...prev, [currentApp.id]: stars }));
      addToast(
        lang === 'id'
          ? `Terima kasih! Rating ${stars}/5 tercatat.`
          : `Thank you! Rated ${stars}/5 stars.`,
        'success'
      );
    },
    [currentApp.id, lang, addToast]
  );

  const handleCopyPackage = useCallback(
    async (pkg: string) => {
      try {
        await navigator.clipboard.writeText(pkg);
      } catch {
        // Fallback silently if clipboard permission unavailable
      }
      addToast(t.appDetail.packageCopied, 'success');
    },
    [addToast, t.appDetail.packageCopied]
  );

  const handleDownloadComplete = useCallback(
    (ver: AppVersion) => {
      setVersionsModalOpen(false);
      addToast(
        lang === 'id'
          ? `Manifest ${currentApp.shortTitle} ${ver.version} siap!`
          : `${currentApp.shortTitle} ${ver.version} package ready!`,
        'success'
      );
    },
    [currentApp.shortTitle, lang, addToast]
  );

  const handleSectionSelect = useCallback((section: NavSection) => {
    setActiveSection(section);
    setDeveloperFilter(null);
    if (section === 'all') {
      setCurrentApp(APPS_CATALOG[0]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById('catalog-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleFilterCategory = useCallback((categorySlug: string) => {
    if (categorySlug === 'apps' || categorySlug === 'video-editors' || categorySlug === 'ai-tools') {
      setActiveSection(categorySlug as NavSection);
    } else {
      setActiveSection('apps');
    }
    setDeveloperFilter(null);
    const el = document.getElementById('catalog-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleFilterDeveloper = useCallback((developer: string) => {
    setDeveloperFilter(developer);
    setActiveSection('all');
    const el = document.getElementById('catalog-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const filteredCatalog = useMemo(() => {
    let list = APPS_CATALOG;
    if (developerFilter) {
      list = list.filter((a) => a.developer === developerFilter);
    } else if (activeSection === 'saved') {
      list = list.filter((a) => savedAppIds.includes(a.id));
    } else if (activeSection === 'video-editors') {
      list = list.filter((a) => a.categorySlug === 'video-editors');
    } else if (activeSection === 'ai-tools') {
      list = list.filter((a) => a.categorySlug === 'ai-tools');
    } else if (activeSection === 'games') {
      list = [];
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.shortTitle.toLowerCase().includes(q) ||
          a.packageName.toLowerCase().includes(q) ||
          a.developer.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeSection, developerFilter, savedAppIds, searchQuery]);

  const filterLabel = useMemo(() => {
    if (developerFilter) return developerFilter;
    if (activeSection === 'saved') return t.nav.saved;
    if (activeSection === 'video-editors') return t.nav.videoEditors;
    if (activeSection === 'ai-tools') return t.nav.aiTools;
    if (activeSection === 'games') return t.nav.games;
    if (activeSection === 'apps') return t.nav.apps;
    return null;
  }, [activeSection, developerFilter, t.nav]);

  const userRating = userRatings[currentApp.id] ?? null;
  const displayRating = userRating
    ? Number(
        (
          (currentApp.rating * currentApp.ratingCount + userRating) /
          (currentApp.ratingCount + 1)
        ).toFixed(1)
      )
    : currentApp.rating;
  const displayRatingCount = userRating
    ? currentApp.ratingCount + 1
    : currentApp.ratingCount;

  const savedApps = useMemo(
    () => APPS_CATALOG.filter((item) => savedAppIds.includes(item.id)),
    [savedAppIds]
  );

  return (
    <div className="min-h-screen bg-[var(--bg-root)] text-[var(--text-main)]">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeSection={activeSection}
        onSelectSection={handleSectionSelect}
        savedCount={savedAppIds.length}
        lang={lang}
        onOpenPreferences={() => setPreferencesModalOpen(true)}
      />

      <TopBar
        onOpenSidebar={() => setSidebarOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        apps={APPS_CATALOG}
        onSelectApp={handleSelectApp}
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'id' ? 'en' : 'id'))}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
      />

      <main className="lg:pl-64 pb-24">
        <HeroBanner
          app={currentApp}
          lang={lang}
          onFilterCategory={handleFilterCategory}
          onFilterDeveloper={handleFilterDeveloper}
          onGoHome={() => handleSectionSelect('all')}
        />

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <StatsAndActions
            app={currentApp}
            displayRating={displayRating}
            displayRatingCount={displayRatingCount}
            lang={lang}
            isSaved={savedAppIds.includes(currentApp.id)}
            onToggleSave={handleToggleSave}
            onOpenDownload={() => setVersionsModalOpen(true)}
            onOpenTutorial={() => setTutorialModalOpen(true)}
            onOpenShare={() => setShareModalOpen(true)}
            onOpenRequestUpdate={() => setRequestModalOpen(true)}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col order-2 lg:order-1">
              <PreviewGallery
                screenshots={currentApp.screenshots}
                lang={lang}
                onOpenPreview={(idx) => setPreviewIndex(idx)}
              />

              <AppDescription
                app={currentApp}
                lang={lang}
                onUnlockReached={() => setDownloadUnlocked(true)}
              />
            </div>

            <SidebarInfoColumn
              app={currentApp}
              lang={lang}
              userRating={userRating}
              onRate={handleRate}
              onCopyPackage={handleCopyPackage}
            />
          </div>

          <div id="catalog-section" className="mt-8">
            <RelatedAppsSection
              apps={filteredCatalog}
              currentAppId={currentApp.id}
              filterLabel={filterLabel}
              lang={lang}
              onSelectApp={handleSelectApp}
              onClearFilter={() => {
                setActiveSection('all');
                setDeveloperFilter(null);
                setSearchQuery('');
              }}
            />
          </div>

          <footer className="mt-14 pt-6 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-tech text-slate-500 dark:text-slate-400">
            <div>Berry Mod Apeka · {currentApp.name}</div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setTutorialModalOpen(true)}
                className="hover:text-blue-500 transition-colors cursor-pointer"
              >
                {t.appDetail.howToDownload}
              </button>
              <button
                type="button"
                onClick={() => setRequestModalOpen(true)}
                className="hover:text-blue-500 transition-colors cursor-pointer"
              >
                {t.appDetail.requestUpdate}
              </button>
              <button
                type="button"
                onClick={() => setShareModalOpen(true)}
                className="hover:text-blue-500 transition-colors cursor-pointer"
              >
                {t.appDetail.share}
              </button>
            </div>
          </footer>
        </div>
      </main>

      <FloatingDownloadBar
        visible={showFloatingBar}
        unlocked={downloadUnlocked}
        lang={lang}
        onClickDownload={() => setVersionsModalOpen(true)}
      />

      <VersionsModal
        isOpen={versionsModalOpen}
        onClose={() => setVersionsModalOpen(false)}
        app={currentApp}
        lang={lang}
        onDownloadComplete={handleDownloadComplete}
      />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        app={currentApp}
        lang={lang}
        onNotify={(msg) => addToast(msg, 'success')}
      />

      <TutorialModal
        isOpen={tutorialModalOpen}
        onClose={() => setTutorialModalOpen(false)}
        lang={lang}
        onOpenVersions={() => setVersionsModalOpen(true)}
      />

      <ImagePreviewModal
        screenshots={currentApp.screenshots}
        activeIndex={previewIndex}
        lang={lang}
        onClose={() => setPreviewIndex(null)}
        onChangeIndex={(idx) => setPreviewIndex(idx)}
      />

      <RequestUpdateModal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        app={currentApp}
        lang={lang}
        onSubmitted={(summary) =>
          addToast(
            lang === 'id'
              ? `Permintaan update terkirim: ${summary}`
              : `Update request sent: ${summary}`,
            'success'
          )
        }
      />

      <PreferencesModal
        isOpen={preferencesModalOpen}
        onClose={() => setPreferencesModalOpen(false)}
        lang={lang}
        onSetLang={setLang}
        theme={theme}
        onSetTheme={setTheme}
        savedApps={savedApps}
        onSelectApp={handleSelectApp}
        onClearSaved={() => {
          setSavedAppIds([]);
          addToast(
            lang === 'id' ? 'Daftar tersimpan dikosongkan' : 'Saved list cleared',
            'info'
          );
        }}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
