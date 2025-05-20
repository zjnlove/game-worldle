import "../styles/globals.css";
import Head from "next/head";
import { store, persistor } from "../store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { useEffect } from 'react';
import { useI18n, initI18n } from '../i18n/i18n-utils';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
	const router = useRouter();
	const { locale } = router;
	const { t } = useI18n('common');
	
	// 初始化国际化
	useEffect(() => {
		initI18n(locale);
	}, [locale]);
	
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://worldle.top';
	
	// 获取页面传递的SEO自定义数据，优先使用pageProps，保证有兜底值
	const pageTitle = pageProps.title || t('seoTitle') || 'Worldle Unlimited';
	const pageDescription = pageProps.description || t('seoDescription') || 'Worldle Unlimited';
	const pageKeywords = pageProps.keywords || t('seoKeywords') || 'worldle, game, geography';
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<Head>
					<title>{`Worldle - ${pageTitle}`}</title>
					<meta name="description" content={pageDescription} />
					<meta name="keywords" content={pageKeywords} />
					
					{/* 规范链接 */}
					<link rel="canonical" href={`${siteUrl}${pageProps.canonicalPath || ''}`} />
					
					{/* Open Graph 标签 */}
					{/* <meta property="og:site_name" content={`Worldle Unlimited`} />
					<meta property="og:title" content={`Worldle - ${pageTitle}`} />
					<meta property="og:description" content={pageDescription} />
					<meta property="og:type" content="website" />
					<meta property="og:url" content={`${siteUrl}${pageProps.canonicalPath || ''}`} />
					<meta property="og:image" content={`${siteUrl}/${pageProps.ogImage || 'worldle-og-image.png'}`} />
					<meta property="og:locale" content={locale || 'en'} />
					 */}
					{/* Twitter 卡片 */}
					{/* <meta name="twitter:card" content="summary_large_image" />
					<meta name="twitter:title" content={`Worldle - ${pageTitle}`} />
					<meta name="twitter:description" content={pageDescription} />
					<meta name="twitter:image" content={`${siteUrl}/${pageProps.ogImage || 'worldle-og-image.png'}`} />
					 */}
					{/* 移动设备元标签 */}
					<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
					<meta name="mobile-web-app-capable" content="yes" />
					<meta name="apple-mobile-web-app-capable" content="yes" />
					
					{/* 站点图标 */}
					<link
						rel="apple-touch-icon"
						sizes="180x180"
						href="/apple-touch-icon.png"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="32x32"
						href="/favicon-32x32.png"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="16x16"
						href="/favicon-16x16.png"
					/>
					<link rel="manifest" href="/site.webmanifest" />
					<link
						rel="mask-icon"
						href="/safari-pinned-tab.svg"
						color="#5bbad5"
					/>
					<meta name="msapplication-TileColor" content="#2d89ef" />
					<meta name="theme-color" content="#ffffff" />
					
					{/* Google AdSense */}
					<script
						async
						src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${process.env.NEXT_PUBLIC_ADSENSE_ID || ''}`}
						crossOrigin="anonymous"
					></script>
					{/* 请将 ca-pub-YOUR_PUBLISHER_ID 替换为您的 AdSense 发布者 ID */}

					{/* Google Analytics */}
					<script async src="https://www.googletagmanager.com/gtag/js?id=G-FV14KERL0S"></script>
					<script
					  dangerouslySetInnerHTML={{
					    __html: `
					      window.dataLayer = window.dataLayer || [];
					      function gtag(){dataLayer.push(arguments);}
					      gtag('js', new Date());
					      gtag('config', 'G-FV14KERL0S');
					    `,
					  }}
					/>
					{/* <script
						type="application/ld+json"
						dangerouslySetInnerHTML={{
							__html: JSON.stringify({
								"@context": "https://schema.org",
								"@type": "WebSite",
								"name": "Worldle Unlimited",
								"alternateName": "WORLDLE UNLIMITED",
								"url": "https://worldle.top"
							})
						}}
					/>
					 */}
					{/* 注入页面特定的结构化数据 */}
					{pageProps.structuredData && (
						<script
							type="application/ld+json"
							dangerouslySetInnerHTML={{ __html: JSON.stringify(pageProps.structuredData) }}
						/>
					)}
				</Head>
				<Component {...pageProps} />
			</PersistGate>
		</Provider>
	);
}

export default MyApp;
