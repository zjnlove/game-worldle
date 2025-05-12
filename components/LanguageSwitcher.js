import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const LanguageSwitcher = () => {
  const router = useRouter();
  const { pathname, asPath, query, locale } = router;
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  // 所有支持的语言及显示名称
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'zh', name: '简体中文' },
    { code: 'tw', name: '繁体中文' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
    { code: 'ru', name: 'Русский' },
    { code: 'hi', name: 'हिन्दी' }
  ];

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
          position: absolute;
          right: 20px;
          top: 20px;
          z-index: 100;
        }
        .language-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background-color: var(--ghibli-green);
          color: white;
          border-radius: 20px;
          font-weight: bold;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .globe-icon {
          color: white;
        }
        .lang-name {
          max-width: 80px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .language-btn:hover {
          background-color: var(--ghibli-soft-blue);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .language-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
          overflow: hidden;
          width: 140px;
          max-height: 320px;
          overflow-y: auto;
          animation: dropdownFadeIn 0.3s ease;
        }
        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dropdown-item {
          display: block;
          padding: 10px 16px;
          color: var(--ghibli-dark);
          font-size: 14px;
          transition: all 0.2s ease;
          text-decoration: none;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }
        .dropdown-item:last-child {
          border-bottom: none;
        }
        .dropdown-item:hover {
          background-color: var(--ghibli-cream);
        }
        .dropdown-item.active {
          background-color: var(--ghibli-soft-green);
          color: var(--ghibli-dark);
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default LanguageSwitcher; 