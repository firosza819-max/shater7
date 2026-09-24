const VERSION_CHECK_INTERVAL = 5 * 60 * 1000;

const getCurrentAppScript = () =>
  document.querySelector('script[type="module"][src]')?.getAttribute('src') || '';

const getAppScriptFromHtml = (html) =>
  html.match(/<script[^>]+type=["']module["'][^>]+src=["']([^"']+)["']/i)?.[1] || '';

const checkForNewVersion = async () => {
  if (document.visibilityState !== 'visible') return;

  try {
    const response = await fetch(`/?pwa-version-check=${Date.now()}`, {
      cache: 'no-store',
      headers: { Accept: 'text/html' },
    });
    if (!response.ok) return;

    const latestHtml = await response.text();
    const currentScript = getCurrentAppScript();
    const latestScript = getAppScriptFromHtml(latestHtml);

    // Vite يضع hash مختلفًا في اسم JS عند كل build جديد.
    // اختلاف الاسم يعني أن Vercel نشر نسخة أحدث من التطبيق.
    if (currentScript && latestScript && currentScript !== latestScript) {
      window.location.reload();
    }
  } catch {
    // فشل فحص التحديث لا يمنع المستخدم من الاستمرار في استخدام التطبيق.
  }
};

export function startPwaAutoUpdate() {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    checkForNewVersion();
    window.setInterval(checkForNewVersion, VERSION_CHECK_INTERVAL);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkForNewVersion();
  });
}
