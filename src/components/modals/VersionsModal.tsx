import React, { useState, useEffect } from 'react';
import {
  X,
  History,
  Download,
  CheckCircle2,
  ShieldCheck,
  Server,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AppItem, AppVersion, LanguageCode } from '../../types/app';
import { TRANSLATIONS } from '../../data/translations';

interface VersionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  app: AppItem;
  lang: LanguageCode;
  onDownloadComplete: (version: AppVersion) => void;
}

export const VersionsModal: React.FC<VersionsModalProps> = ({
  isOpen,
  onClose,
  app,
  lang,
  onDownloadComplete,
}) => {
  const [selectedMirror, setSelectedMirror] = useState<'direct' | 'mirror'>('direct');
  const [expandedChangelog, setExpandedChangelog] = useState<string | null>(
    app.versions[0]?.id ?? null
  );
  const [downloadingVersion, setDownloadingVersion] = useState<AppVersion | null>(null);
  const [progress, setProgress] = useState(0);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    if (!isOpen) {
      setDownloadingVersion(null);
      setProgress(0);
      return;
    }
    setExpandedChangelog(app.versions[0]?.id ?? null);
  }, [isOpen, app.id, app.versions]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!downloadingVersion) return;
    setProgress(8);
    const interval = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          window.clearInterval(interval);
          return 100;
        }
        return Math.min(100, prev + 16);
      });
    }, 180);
    return () => window.clearInterval(interval);
  }, [downloadingVersion]);

  useEffect(() => {
    if (progress === 100 && downloadingVersion) {
      const doneVersion = downloadingVersion;
      const timer = window.setTimeout(() => {
        const manifestContent = [
          `Berry Mod Apeka - Verified Package Manifest`,
          `App: ${app.name}`,
          `Package: ${app.packageName}`,
          `Version: ${doneVersion.version} (${doneVersion.label})`,
          `Architecture: ${doneVersion.architecture}`,
          `Size: ${doneVersion.size}`,
          `Min Android: ${doneVersion.minAndroid}`,
          `Mirror: ${selectedMirror === 'direct' ? 'Direct Cloud Server (SG-1)' : 'Mirror CDN Asia'}`,
          `SHA-256: ${doneVersion.sha256}`,
          `Status: Clean 0/${app.securityReport.totalEngines} VirusTotal`,
        ].join('\n');

        const blob = new Blob([manifestContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${app.slug}_${doneVersion.version}_VIP_BerryMod.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        onDownloadComplete(doneVersion);
        setDownloadingVersion(null);
        setProgress(0);
      }, 350);
      return () => window.clearTimeout(timer);
    }
  }, [progress, downloadingVersion, app, selectedMirror, onDownloadComplete]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={t.appDetail.selectVersion}
    >
      <div className="bg-white dark:bg-[#090b10] border-t sm:border border-slate-200 dark:border-white/10 rounded-t-3xl sm:rounded-3xl p-6 sm:p-7 w-full max-w-lg shadow-2xl relative max-h-[90vh] flex flex-col">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close version modal"
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 p-2 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3.5 mb-5 shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-500">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t.appDetail.selectVersion}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono-tech">
              {app.name} · {t.appDetail.versionHistory}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 mb-4 shrink-0">
          <button
            type="button"
            onClick={() => setSelectedMirror('direct')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono-tech font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              selectedMirror === 'direct'
                ? 'bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5 shrink-0" />
            <span>Direct Cloud (SG-1)</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedMirror('mirror')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono-tech font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              selectedMirror === 'mirror'
                ? 'bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5 shrink-0" />
            <span>Mirror CDN Asia</span>
          </button>
        </div>

        {downloadingVersion && (
          <div className="mb-4 p-4 rounded-2xl border border-blue-500/30 bg-blue-500/[0.08] space-y-2 shrink-0">
            <div className="flex items-center justify-between text-xs font-mono-tech">
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {lang === 'id'
                  ? `Menyiapkan ${app.shortTitle} ${downloadingVersion.version}...`
                  : `Preparing ${app.shortTitle} ${downloadingVersion.version}...`}
              </span>
              <span className="font-bold text-slate-900 dark:text-white">{progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="space-y-3 overflow-y-auto pr-1 flex-1 min-h-0">
          {app.versions.map((ver) => {
            const isExpanded = expandedChangelog === ver.id;
            const isBusy = downloadingVersion?.id === ver.id;
            return (
              <div
                key={ver.id}
                className={`rounded-2xl border p-4 transition-colors ${
                  ver.isLatest
                    ? 'border-blue-500/40 bg-blue-500/[0.04]'
                    : 'border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono-tech text-sm font-bold text-slate-900 dark:text-white">
                        {ver.version}
                      </span>
                      {ver.isLatest && (
                        <span className="text-[11px] font-mono-tech font-bold text-blue-600 dark:text-blue-400">
                          · Latest
                        </span>
                      )}
                      {ver.isVip && (
                        <span className="text-[11px] font-mono-tech font-semibold text-emerald-600 dark:text-emerald-400">
                          · VIP+
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono-tech mt-1">
                      {ver.size} · {ver.architecture} · {ver.releaseDate}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!!downloadingVersion}
                    onClick={() => setDownloadingVersion(ver)}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-mono-tech font-bold inline-flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shrink-0 whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isBusy ? `${progress}%` : t.appDetail.downloadApk}</span>
                  </button>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/70 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => setExpandedChangelog(isExpanded ? null : ver.id)}
                    className="text-[11px] font-mono-tech text-slate-500 dark:text-slate-400 hover:text-blue-500 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{ver.label}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {isExpanded && (
                    <ul className="mt-2 space-y-1.5">
                      {ver.changelog[lang].map((line, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-center gap-2 text-xs font-mono-tech text-slate-500 dark:text-slate-400 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{t.appDetail.secureSystem}</span>
        </div>
      </div>
    </div>
  );
};
