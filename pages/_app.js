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
