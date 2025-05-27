import { i18n } from '../../i18n/config';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({ children, params }) {
  return children;
} 