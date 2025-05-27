import { i18n } from '../i18n/config';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ClientPage from './[locale]/ClientPage';
import { generateStructuredData, loadTranslation } from './[locale]/page';

// 为页面定义元数据
export async function generateMetadata() {
  // 使用默认语言
  const locale = i18n.defaultLocale;
  
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

export default function Home() {
  // 检查cookie中是否有用户选择的语言
  const cookieStore = cookies();
  const preferredLanguage = cookieStore.get('NEXT_LOCALE')?.value;
  
  // 只在生产环境中处理重定向，开发环境保持当前路径以便测试
  if (process.env.NODE_ENV === 'production') {
    // 如果有用户选择的语言且该语言受支持且不是默认语言，则重定向到该语言页面
    if (preferredLanguage && 
        i18n.locales.includes(preferredLanguage) && 
        preferredLanguage !== i18n.defaultLocale) {
      redirect(`/${preferredLanguage}`);
    }
  }
  
  // 如果是默认语言或没有语言选择，直接显示默认语言内容（不重定向）
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateStructuredData()) }}
      />
      <ClientPage locale={i18n.defaultLocale} />
    </>
  );
} 