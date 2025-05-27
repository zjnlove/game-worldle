import Index from './index';
import { i18n } from '../../i18n/config';
import { redirect } from 'next/navigation';
import fs from 'fs';
import path from 'path';

// 服务器端加载翻译文件
export const loadTranslation = (locale, namespace) => {
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

// 为页面定义元数据
export async function generateMetadata({ params }) {
  const { locale } = params;
  
  // 验证语言是否支持
  if (!i18n.locales.includes(locale)) {
    return generateMetadata({ params: { locale: i18n.defaultLocale } });
  }
  
  // 从国际化文件中加载翻译
  const translations = loadTranslation(locale, 'common');
  
  // 翻译函数
  const t = (key) => {
    return translations[key] || key;
  };
  
  // 明确设置完整的标题结构
  return {
    title: {
      absolute: `Worldle - ${t('seoTitle')}`,
    },
    description: t('seoDescription'),
    keywords: t('seoKeywords'),
  };
}

export default function LocalePage({ params }) {
  const { locale } = params;
  
  // 验证语言是否支持，如果不支持则重定向到默认语言
  if (!i18n.locales.includes(locale)) {
    // 使用 notFound() 而不是重定向
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold">Language not supported</h1>
        <p>Sorry, we don't support "{locale}" language.</p>
      </div>
    );
  }
  
  // 如果是默认语言，重定向到根路径（不显示语言前缀）
  // 但只在生产环境中执行，开发环境中保持当前路径以便测试
  if (locale === i18n.defaultLocale && process.env.NODE_ENV === 'production') {
    redirect('/');
  }

  return <Index locale={locale} />;
} 