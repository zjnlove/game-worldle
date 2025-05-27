import { redirect } from 'next/navigation';
import { i18n } from '../../i18n/config';
import ClientPage from './ClientPage';

// 添加结构化数据
export const generateStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Worldle Unlimited",
    "alternateName": "WORLDLE UNLIMITED",
    "description": "Play Worldle Unlimited, the fun geography game where you guess countries from their silhouette. Enjoy unlimited games with Worldle Unlimited.",
    "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://worldle.top',
    "applicationCategory": "GameApplication",
    "genre": "Geography Quiz",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };
};

// 为页面定义元数据
export async function generateMetadata({ params }) {
  // 这里可以根据不同的页面和语言返回不同的元数据
  return {
    title: 'Home', // 这会被模板处理为 "Worldle - Home"
  };
}

export default function IndexPage({ params }) {
  const { locale } = params;

  // 验证语言是否支持，如果不支持则重定向到默认语言
  if (!i18n.locales.includes(locale)) {
    redirect(`/${i18n.defaultLocale}`);
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateStructuredData()) }}
      />
      <ClientPage locale={locale} />
    </>
  );
} 