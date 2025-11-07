/**
 * Sistema de gestión de cookies con carga condicional de scripts
 */

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  advertising: boolean;
  timestamp: number;
}

/**
 * Obtener las preferencias de cookies guardadas
 */
export function getCookiePreferences(): CookiePreferences | null {
  if (typeof window === 'undefined') return null;
  
  const saved = localStorage.getItem('cookiePreferences');
  if (!saved) return null;
  
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

/**
 * Guardar las preferencias de cookies
 */
export function saveCookiePreferences(preferences: CookiePreferences): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
  localStorage.setItem('cookieBannerDismissed', 'true');
  
  // Aplicar las preferencias inmediatamente
  applyPreferences(preferences);
}

/**
 * Cargar Google Analytics
 */
function loadGoogleAnalytics(measurementId: string): void {
  // Cargar el script de Google Analytics
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Inicializar Google Analytics
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  gtag('js', new Date());
  gtag('config', measurementId);

  console.log('✅ Google Analytics cargado');
}

/**
 * Cargar Facebook Pixel
 */
function loadFacebookPixel(pixelId: string): void {
  // Cargar Facebook Pixel
  !(function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function() {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    'script',
    'https://connect.facebook.net/en_US/fbevents.js'
  );

  window.fbq('init', pixelId);
  window.fbq('track', 'PageView');

  console.log('✅ Facebook Pixel cargado');
}

/**
 * Cargar Google Ads (Conversion Tracking)
 */
function loadGoogleAds(conversionId: string): void {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${conversionId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  gtag('js', new Date());
  gtag('config', conversionId);

  console.log('✅ Google Ads cargado');
}

/**
 * Bloquear cookies de terceros
 */
function blockThirdPartyCookies(): void {
  // Eliminar cookies de Google Analytics
  const cookiesToDelete = [
    '_ga',
    '_gid',
    '_gat',
    '_gat_gtag_UA_',
    '_gcl_au',
    '_fbp',
    '_fbc',
    'fr'
  ];

  cookiesToDelete.forEach(cookieName => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`;
  });

  console.log('🚫 Cookies de terceros bloqueadas');
}

/**
 * Aplicar las preferencias de cookies
 */
export function applyPreferences(preferences: CookiePreferences): void {
  // COOKIES DE ANÁLISIS (Google Analytics)
  if (preferences.analytics) {
    // Reemplaza 'G-XXXXXXXXXX' con tu ID real de Google Analytics
    const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
    loadGoogleAnalytics(GA_MEASUREMENT_ID);
  }

  // COOKIES DE PUBLICIDAD (Facebook Pixel, Google Ads)
  if (preferences.advertising) {
    // Reemplaza con tus IDs reales
    const FB_PIXEL_ID = '1234567890';
    const GOOGLE_ADS_ID = 'AW-XXXXXXXXX';

    loadFacebookPixel(FB_PIXEL_ID);
    loadGoogleAds(GOOGLE_ADS_ID);
  } else {
    blockThirdPartyCookies();
  }
}

/**
 * Inicializar el sistema de cookies
 * Debe llamarse al cargar la página
 */
export function initCookieManager(): void {
  if (typeof window === 'undefined') return;

  const preferences = getCookiePreferences();

  if (preferences) {
    // Si hay preferencias guardadas, aplicarlas
    applyPreferences(preferences);
  }
}

/**
 * Verificar si el banner debe mostrarse
 */
export function shouldShowBanner(): boolean {
  if (typeof window === 'undefined') return false;
  
  const dismissed = localStorage.getItem('cookieBannerDismissed');
  return dismissed !== 'true';
}

/**
 * Obtener estadísticas de cookies actuales
 */
export function getCookieStats(): {
  total: number;
  analytics: number;
  advertising: number;
  necessary: number;
} {
  const cookies = document.cookie.split(';');
  const stats = {
    total: cookies.length,
    analytics: 0,
    advertising: 0,
    necessary: 0
  };

  cookies.forEach(cookie => {
    const name = cookie.trim().split('=')[0];
    
    // Cookies de análisis
    if (name.startsWith('_ga') || name.startsWith('_gid') || name.startsWith('_gat')) {
      stats.analytics++;
    }
    // Cookies de publicidad
    else if (name.startsWith('_fb') || name === 'fr' || name.startsWith('_gcl')) {
      stats.advertising++;
    }
    // Cookies necesarias
    else {
      stats.necessary++;
    }
  });

  return stats;
}

// Declaraciones de tipos para TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    fbq: any;
    _fbq: any;
  }
}

