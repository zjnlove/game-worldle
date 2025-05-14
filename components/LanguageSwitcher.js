import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getSupportedLanguages } from '../i18n/i18n-utils';

const LanguageSwitcher = () => {
  const router = useRouter();
  const { pathname, asPath, query, locale } = router;
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
              href={{ pathname, query }}
              as={asPath}
              locale={lang.code}
              legacyBehavior
            >
              <a 
                className={`dropdown-item ${locale === lang.code ? 'active' : ''}`}
                onClick={() => setShowDropdown(false)}
              >
                {lang.name}
              </a>
            </Link>
          ))}
        </div>
      )}
      
      <style jsx>{`
        .language-switcher {
          z-index: 10;
          position: relative;
        }
        .language-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background-color: ${isDarkMode ? 'var(--ghibli-blue)' : 'var(--ghibli-green)'};
          color: white;
          border-radius: 20px;
          font-weight: bold;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
          position: relative;
          overflow: hidden;
        }
        .language-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, 
            ${isDarkMode 
              ? 'var(--ghibli-blue), var(--ghibli-shadow-blue)' 
              : 'var(--ghibli-green), var(--ghibli-soft-green)'});
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }
        .globe-icon {
          color: white;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
        }
        .lang-name {
          max-width: 80px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .language-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
        }
        .language-btn:hover::before {
          opacity: 1;
        }
        .language-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          background-color: ${isDarkMode ? 'var(--ghibli-dark-blue)' : 'white'};
          border-radius: 12px;
          box-shadow: 0 6px 16px rgba(0, 0, 0, ${isDarkMode ? '0.25' : '0.12'});
          overflow-y: auto;
          width: 140px;
          max-height: 400px;
          animation: dropdownFadeIn 0.3s ease;
          border: 1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'};
          margin-top: 8px;
        }
        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dropdown-item {
          display: block;
          padding: 10px 16px;
          color: ${isDarkMode ? '#ffffff' : 'var(--ghibli-dark)'};
          font-size: 14px;
          transition: all 0.2s ease;
          text-decoration: none;
          border-bottom: 1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
          font-weight: ${isDarkMode ? '500' : 'normal'};
        }
        .dropdown-item:last-child {
          border-bottom: none;
        }
        .dropdown-item:hover {
          background-color: ${isDarkMode ? 'var(--ghibli-shadow-blue)' : 'var(--ghibli-cream)'};
          color: ${isDarkMode ? '#ffffff' : 'var(--ghibli-dark)'};
        }
        .dropdown-item.active {
          background-color: ${isDarkMode ? 'var(--ghibli-blue)' : 'var(--ghibli-soft-green)'};
          color: ${isDarkMode ? '#ffffff' : 'var(--ghibli-dark)'};
          font-weight: bold;
          box-shadow: ${isDarkMode ? 'inset 0 0 10px rgba(0, 0, 0, 0.2)' : 'none'};
        }
        
        @media (max-width: 768px) {
          .language-btn {
            padding: 6px 10px;
            font-size: 12px;
          }
          
          .globe-icon {
            width: 16px;
            height: 16px;
          }
          
          .lang-name {
            max-width: 60px;
          }
          
          .language-dropdown {
            width: 120px;
            right: 0;
            left: auto;
          }
          
          .dropdown-item {
            padding: 8px 12px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default LanguageSwitcher; 