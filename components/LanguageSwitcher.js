'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import { getSupportedLanguages } from '../i18n/i18n-utils';
import '../styles/LanguageSwitcher.css';
import { i18n } from '../i18n/config';

const LanguageSwitcher = () => {
  const pathname = usePathname();
  const params = useParams();
  
  // 从路径中提取语言代码
  const pathnameLocale = pathname?.split('/')[1];
  const locale = pathnameLocale || 'en';
  
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  // 获取支持的语言列表
  const languages = getSupportedLanguages();

  // 获取当前语言的显示名称
  const getCurrentLanguageName = () => {
    const currentLang = languages.find(lang => lang.code === locale);
    return currentLang ? currentLang.name : 'English';
  };
  
  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // 检测当前主题
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    const checkDarkMode = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDarkMode(theme === 'dark');
    };
    
    // 初始检测
    checkDarkMode();
    
    // 创建一个观察器监听data-theme属性变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          checkDarkMode();
        }
      });
    });
    
    // 开始观察
    observer.observe(document.documentElement, { attributes: true });
    
    // 清理观察器
    return () => observer.disconnect();
  }, []);

  // 构建语言切换链接
  const getLanguageHref = (langCode) => {
    // 如果是默认语言(英语)，返回根路径
    if (langCode === i18n.defaultLocale) {
      return '/';
    }
    
    // 如果当前路径是根路径或语言路径，直接返回新语言路径
    if (pathname === '/' || pathname === `/${locale}`) {
      return `/${langCode}`;
    }
    
    // 否则，替换路径中的语言代码
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    return `/${langCode}${pathWithoutLocale}`;
  };
  
  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button 
        className="language-btn"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <svg className="globe-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
        <span className="lang-name">{getCurrentLanguageName()}</span>
      </button>
      
      {showDropdown && (
        <div className="language-dropdown">
          {languages.map(lang => (
            <Link
              key={lang.code}
              href={getLanguageHref(lang.code)}
              className={`dropdown-item ${locale === lang.code ? 'active' : ''}`}
              onClick={() => setShowDropdown(false)}
            >
              {lang.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher; 