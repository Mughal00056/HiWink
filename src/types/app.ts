export type LanguageCode = 'id' | 'en';
export type ThemeMode = 'dark' | 'light';

export interface AppVersion {
  id: string;
  version: string;
  label: string;
  size: string;
  architecture: string;
  releaseDate: string;
  minAndroid: string;
  sha256: string;
  changelog: {
    id: string[];
    en: string[];
  };
  isLatest?: boolean;
  isVip?: boolean;
}

export interface PreviewScreenshot {
  id: string;
  src: string;
  title: string;
  caption: {
    id: string;
    en: string;
  };
}

export interface SecurityScanSummary {
  cleanCount: number;
  totalEngines: number;
  scanDate: string;
  sha256: string;
  fileSize: string;
  signatureStatus: string;
  reportUrl: string;
  engines: Array<{
    name: string;
    status: 'Undetected' | 'Clean';
    category: string;
  }>;
}

export interface AppItem {
  id: string;
  slug: string;
  name: string;
  shortTitle: string;
  developer: string;
  category: string;
  categorySlug: string;
  packageName: string;
  version: string;
  size: string;
  rating: number;
  ratingCount: number;
  updatedAt: string;
  views: number;
  minAndroid: string;
  architecture: string;
  isVip: boolean;
  isNew: boolean;
  isSoon?: boolean;
  iconUrl: string;
  heroBannerUrl: string;
  playStoreUrl: string;
  modFeatures: {
    id: string[];
    en: string[];
  };
  description: {
    id: string[];
    en: string[];
  };
  screenshots: PreviewScreenshot[];
  versions: AppVersion[];
  securityReport: SecurityScanSummary;
}

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}
