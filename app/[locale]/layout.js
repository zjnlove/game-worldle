import { i18n } from '../../i18n/config';

export async function generateStaticParams() {
  // 只为非默认语言生成路由
  return i18n.locales
    .filter(locale => locale !== i18n.defaultLocale)
    .map((locale) => ({ locale }));
}

export default function LocaleLayout({ children, params }) {
  return children;
} 