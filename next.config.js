const { i18n } = require('./i18n/config');

/** @type {import('next').NextConfig} */
const nextConfig = {
	i18n,
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/i,
			issuer: /\.[jt]sx?$/,
			use: ["@svgr/webpack"],
		});

		return config;
	},
	images: {
		domains: ["raw.githubusercontent.com"],
	},
	productionBrowserSourceMaps: false,
	swcMinify: true,
};

module.exports = nextConfig;
