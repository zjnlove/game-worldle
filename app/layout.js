import { Providers } from './providers';
import { i18n } from '../i18n/config';
import fs from 'fs';
import path from 'path';

// 引入全局样式
import '../styles/globals.css';
import '../styles/index.css';
import '../styles/LanguageSwitcher.css';
import '../styles/ThemeToggle.css';

// 服务器端加载翻译文件
const loadTranslation = (locale, namespace) => {
  try {
    const filePath = path.join(process.cwd(), 'i18n', 'locales', locale, `${namespace}.json`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Failed to load translation file for locale ${locale} and namespace ${namespace}`, error);
    // 如果加载失败，尝试使用默认语言
    if (locale !== i18n.defaultLocale) {
      return loadTranslation(i18n.defaultLocale, namespace);
    }
    return {};
  }
};

export async function generateMetadata({ params }) {
  // 获取当前语言
  const locale = params?.locale || i18n.defaultLocale;
  
  // 从国际化文件中加载翻译
  const translations = loadTranslation(locale, 'common');
  
  // 翻译函数
  const t = (key) => {
    return translations[key] || key;
  };

  return {
    applicationName: 'Worldle Unlimited',
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://worldle.top'),
    alternates: {
      canonical: '/',
      languages: {
        'en': '/',
        'zh': '/zh',
        'tw': '/tw',
        'ja': '/ja',
        'ko': '/ko',
        'de': '/de',
        'fr': '/fr',
        'ru': '/ru',
        'hi': '/hi',
      },
    },
    icons: {
      icon: [
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
      other: [
        { url: '/safari-pinned-tab.svg', rel: 'mask-icon', color: '#5bbad5' },
      ],
    },
    manifest: '/site.webmanifest',
    themeColor: '#ffffff',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    appleWebApp: {
      capable: true,
    },
    formatDetection: {
      telephone: false,
    },
    title: {
      default: t('seoTitle'),
    },
    description: t('seoDescription'),
    keywords: t('seoKeywords'),
    openGraph: {
      title: `Worldle - ${t('seoTitle')}`,
      description: t('seoDescription'),
      url: '/',
      siteName: 'Worldle Unlimited',
      locale: locale,
      type: 'website',
      images: [
        {
          url: '/worldle-og-image.png',
          width: 1200,
          height: 630,
          alt: 'Worldle',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Worldle - ${t('seoTitle')}`,
      description: t('seoDescription'),
      images: ['/worldle-og-image.png'],
    },
    other: {
      'msapplication-TileColor': '#2d89ef',
    },
  };
}

export default function RootLayout({ children, params }) {
  // 获取当前语言
  const locale = params?.locale || i18n.defaultLocale;
  
  return (
    <html lang={locale}>
      <head>
        {/* 在 Next.js 13 中，不需要在 head 中手动添加脚本，可以在 body 中使用 Script 组件 */}
        
        {/* Google AdSense */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${process.env.NEXT_PUBLIC_ADSENSE_ID || ''}`}
          crossOrigin="anonymous"
        />
        
        {/* Google Analytics */}
        <script 
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-FV14KERL0S" 
        />
        <script id="google-analytics" dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FV14KERL0S');
          `
        }} />
        
        {/* 结构化数据 JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: `
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Worldle Unlimited",
              "url": "${process.env.NEXT_PUBLIC_SITE_URL || 'https://worldle.top'}",
              "description": "A daily geography guessing game about countries/regions, similar to Wordle but focused on world geography.",
              "applicationCategory": "GameApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "screenshot": "${process.env.NEXT_PUBLIC_SITE_URL || 'https://worldle.top'}/worldle-og-image.png"
            }
          `
        }} />
        
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
} 