'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { i18n } from './config';

// 缓存已加载的语言包
const loadedNamespaces = {};

/**
 * 动态加载语言包
 * @param {string} locale 语言代码
 * @param {string} ns 命名空间
 * @returns {Promise<Object>} 语言包对象
 */
export const loadNamespace = async (locale, ns) => {
  const cacheKey = `${locale}:${ns}`;
  
  // 如果已经加载过，直接返回缓存
  if (loadedNamespaces[cacheKey]) {
    return loadedNamespaces[cacheKey];
  }
  
  try {
    // 动态导入语言包
    const module = await import(`./locales/${locale}/${ns}.json`);
    
    // 缓存语言包
    loadedNamespaces[cacheKey] = module.default || module;
    return loadedNamespaces[cacheKey];
  } catch (error) {
    console.error(`Failed to load namespace "${ns}" for locale "${locale}"`, error);
    return {};
  }
};

/**
 * 预加载默认命名空间
 * @param {string} locale 语言代码
 */
export const preloadDefaultNamespaces = async (locale) => {
  const defaultNS = 'common';
  const allNS = ['common', 'countries', 'game-intro', 'game-faq'];
  
  // 优先加载默认命名空间
  await loadNamespace(locale, defaultNS);
  
  // 异步加载其他命名空间
  allNS.forEach(ns => {
    if (ns !== defaultNS) {
      // 使用Promise但不等待，允许后台加载
      loadNamespace(locale, ns);
    }
  });
};

/**
 * 自定义翻译Hook - 适用于 App Router
 * @param {string} namespace 命名空间
 * @param {Object} options 选项
 * @returns {Object} 包含t函数的对象
 */
export const useI18n = (namespace = 'common', options = {}) => {
  const params = useParams();
  const locale = params?.locale || i18n.defaultLocale;
  const [translations, setTranslations] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // 加载请求的命名空间
    loadNamespace(locale, namespace)
      .then(data => {
        setTranslations(data);
        setIsLoaded(true);
      })
      .catch(error => {
        console.error(`Failed to load translations for "${namespace}"`, error);
        setIsLoaded(true); // 即使出错也标记为已加载
      });
  }, [locale, namespace]);
  
  /**
   * 翻译函数
   * @param {string} key 翻译键
   * @param {string} defaultValue 默认值
   * @returns {string} 翻译文本
   */
  const t = (key, defaultValue = key) => {
    if (!isLoaded) return defaultValue;
    return translations[key] || defaultValue;
  };
  
  return {
    t,
    isLoaded,
    locale,
    translations
  };
};

/**
 * 获取支持的所有语言
 * @returns {Array} 语言列表
 */
export const getSupportedLanguages = () => {
  return i18n.locales.map(code => {
    // 语言显示名称映射
    const nameMap = {
      'en': 'English',
      'zh': '简体中文',
      'tw': '繁体中文',
      'ja': '日本語',
      'ko': '한국어',
      'de': 'Deutsch',
      'fr': 'Français',
      'ru': 'Русский',
      'hi': 'हिन्दी'
    };
    
    return {
      code,
      name: nameMap[code] || code
    };
  });
};

/**
 * 初始化i18n
 * @param {string} locale 语言代码
 */
export const initI18n = async (locale) => {
  const actualLocale = locale || i18n.defaultLocale;
  return preloadDefaultNamespaces(actualLocale);
}; 