const { i18n } = require('./i18n/config');

/** @type {import('next').NextConfig} */
const nextConfig = {
	// 当使用 App Router 时，i18n 配置应该移除，因为我们使用的是 [locale] 动态路由
	// i18n,
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/i,
			issuer: /\.[jt]sx?$/,
			use: ["@svgr/webpack"],
		});

		return config;
	},
	images: {
		domains: ["game-worldle.vercel.app"],
	},
	productionBrowserSourceMaps: false,
	swcMinify: true,
	// App router 现在是默认功能，不需要这个配置
	// experimental: {
	// 	appDir: true,
	// },
};

module.exports = nextConfig;
