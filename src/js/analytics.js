(() => {
  'use strict';

  const initAnalytics = () => {
    const id = typeof window !== 'undefined' ? window.NEXORA_ANALYTICS_ID : undefined;
    if (!id) return;

    try {
      const script = document.createElement('script');
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);

      const config = document.createElement('script');
      config.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '` + id + `');
      `;
      document.head.appendChild(config);
    } catch (_) {}
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnalytics);
  } else {
    initAnalytics();
  }
})();
