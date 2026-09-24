import { useEffect, useState } from 'react';
import { Download, MonitorDown, X } from 'lucide-react';

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true;

/**
 * شريط تثبيت تطبيق سطح المكتب.
 * يعتمد على beforeinstallprompt في Chrome وEdge، ويخفي نفسه بعد التثبيت.
 */
export function PwaInstallBar() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches
  );
  const [showInstallHelp, setShowInstallHelp] = useState(false);

  useEffect(() => {
    // لا نستخدم pointer: fine لأن بعض أجهزة الكمبيوتر والشاشات اللمسية
    // قد تُعرّف المؤشر كـ coarse رغم أنها بيئة Desktop كاملة.
    const desktopQuery = window.matchMedia('(min-width: 768px)');
    const updateDesktop = () => setIsDesktop(desktopQuery.matches);
    const updateInstalled = () => setIsInstalled(isStandalone());
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
      setShowInstallHelp(false);
    };
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    updateDesktop();
    updateInstalled();
    desktopQuery.addEventListener('change', updateDesktop);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      desktopQuery.removeEventListener('change', updateDesktop);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (isInstalling) return;
    if (!installPrompt) {
      setShowInstallHelp(true);
      return;
    }

    setIsInstalling(true);
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setIsInstalled(true);
    setInstallPrompt(null);
    setIsInstalling(false);
  };

  if (isInstalled || isDismissed || !isDesktop) return null;

  return (
    <aside
      className="fixed inset-x-0 bottom-0 z-[100] px-4 pb-4 md:px-8"
      role="region"
      aria-label="تثبيت تطبيق شاطر"
    >
      <div className="mx-auto flex max-w-5xl items-center gap-4 rounded-2xl border border-indigo-200/70 bg-slate-950 px-5 py-4 text-white shadow-2xl shadow-indigo-950/30 dark:border-slate-700">
        <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300 sm:flex">
          <MonitorDown size={25} strokeWidth={1.8} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold sm:text-base">ثبّت شاطر كتطبيق على الكمبيوتر</p>
          <p className="mt-0.5 text-xs text-slate-300 sm:text-sm">
            افتح النظام بسرعة من سطح المكتب، حتى بدون تبويب المتصفح.
          </p>
        </div>
        <button
          type="button"
          onClick={handleInstall}
          disabled={isInstalling}
          title="تثبيت التطبيق على الكمبيوتر"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-wait disabled:opacity-70 sm:px-5"
        >
          <Download size={18} aria-hidden="true" />
          <span>{isInstalling ? 'جارٍ التثبيت...' : 'تثبيت التطبيق على الكمبيوتر'}</span>
        </button>
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/60"
          aria-label="إخفاء شريط التثبيت"
        >
          <X size={19} aria-hidden="true" />
        </button>
      </div>
      {showInstallHelp && (
        <p className="mx-auto mt-2 max-w-5xl rounded-lg bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-900 shadow dark:bg-amber-950 dark:text-amber-100">
          لا يدعم هذا المتصفح نافذة التثبيت الفورية حاليًا. استخدم Chrome أو Edge، ثم افتح قائمة المتصفح واختر «تثبيت شاطر».
        </p>
      )}
    </aside>
  );
}

export default PwaInstallBar;
