import React, { useState, useEffect } from 'react';
import { X, PlayCircle, Download, ShieldCheck, Smartphone, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { LanguageCode } from '../../types/app';
import { TRANSLATIONS } from '../../data/translations';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: LanguageCode;
  onOpenVersions: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  lang,
  onOpenVersions,
}) => {
  const [step, setStep] = useState(0);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    if (!isOpen) return;
    setStep(0);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const steps =
    lang === 'id'
      ? [
          {
            title: '1. Pilih Versi & Server Unduhan',
            desc: 'Klik tombol Download Sekarang lalu pilih versi terbaru (v3.15.0 VIP+ Unlocked) dan server cloud terdekat.',
            icon: <Download className="w-8 h-8 text-blue-500" />,
            tip: 'Gunakan Direct Cloud (SG-1) untuk kecepatan tertinggi.',
          },
          {
            title: '2. Verifikasi Keamanan SHA-256',
            desc: 'Sistem memastikan paket APK lolos pemindaian 64/64 engine VirusTotal tanpa malware atau iklan sisipan.',
            icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />,
            tip: 'Hapus versi Play Store sebelumnya bila terjadi konflik signature.',
          },
          {
            title: '3. Izinkan Instalasi Sumber Tidak Dikenal',
            desc: 'Buka Pengaturan Android > Keamanan / Privasi > aktifkan "Install unknown apps" untuk browser Anda.',
            icon: <Smartphone className="w-8 h-8 text-purple-500" />,
            tip: 'Diperlukan sekali saja di Android 8.0 hingga Android 15.',
          },
          {
            title: '4. Buka Wink & Nikmati VIP+ Unlocked',
            desc: 'Jalankan aplikasi Wink. Semua fitur Ultra HD 4K, AI Facial Retouch, dan Batch Export aktif tanpa login VIP.',
            icon: <CheckCircle2 className="w-8 h-8 text-amber-500" />,
            tip: 'Matikan auto-update di Play Store agar mod tidak tertimpa.',
          },
        ]
      : [
          {
            title: '1. Choose Version & Cloud Server',
            desc: 'Click Download Now, choose the latest build (v3.15.0 VIP+ Unlocked), and select Direct Cloud or Mirror CDN.',
            icon: <Download className="w-8 h-8 text-blue-500" />,
            tip: 'Direct Cloud (SG-1) offers the fastest single-tap transfer.',
          },
          {
            title: '2. Verify Clean SHA-256 Checksum',
            desc: 'Every release is verified clean across 64 security engines on VirusTotal with ad SDKs removed.',
            icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />,
            tip: 'Uninstall the original Play Store build first if you see a signature mismatch.',
          },
          {
            title: '3. Allow Unknown Apps Permission',
            desc: 'In Android Settings > Security > Install unknown apps, enable permission for your browser or file manager.',
            icon: <Smartphone className="w-8 h-8 text-purple-500" />,
            tip: 'One-time permission required on Android 8.0 through Android 15.',
          },
          {
            title: '4. Launch Wink with VIP+ Unlocked',
            desc: 'Open Wink to access Ultra HD 4K restoration, AI Facial Retouching, and watermark-free batch exports.',
            icon: <CheckCircle2 className="w-8 h-8 text-amber-500" />,
            tip: 'Disable auto-update for Wink in Play Store to keep mod features.',
          },
        ];

  const current = steps[step];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={t.appDetail.tutorialTitle}
    >
      <div className="bg-white dark:bg-[#0b0d13] border border-slate-200 dark:border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close tutorial modal"
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 p-2 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="font-display text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mb-5 flex items-center gap-2.5 pr-8">
          <PlayCircle className="w-5 h-5 text-blue-500 shrink-0" />
          <span>{t.appDetail.tutorialTitle}</span>
        </h3>

        <div className="flex items-center gap-1.5 mb-5">
          {steps.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setStep(idx)}
              aria-label={`Step ${idx + 1}`}
              className={`h-1.5 flex-1 rounded-full transition-all cursor-pointer ${
                idx === step
                  ? 'bg-blue-600'
                  : idx < step
                  ? 'bg-blue-400/50'
                  : 'bg-slate-200 dark:bg-white/10'
              }`}
            />
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#050505] p-6 text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 flex items-center justify-center mx-auto shadow-sm">
            {current.icon}
          </div>
          <h4 className="font-bold text-base text-slate-900 dark:text-white">
            {current.title}
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {current.desc}
          </p>
          <div className="pt-2 text-[11px] font-mono-tech text-blue-600 dark:text-blue-400">
            {current.tip}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 mt-5">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-mono-tech font-semibold text-slate-700 dark:text-slate-200 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{lang === 'id' ? 'Sebelumnya' : 'Previous'}</span>
          </button>

          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono-tech font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>{lang === 'id' ? 'Lanjut' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenVersions();
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono-tech font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.appDetail.downloadNow}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
