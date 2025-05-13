import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { t, i18n } = useTranslation('common');

  // 在组件加载时读取存储的主题设置
  useEffect(() => {
    // 检查localStorage中是否有主题设置
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // 如果有保存的设置则使用，否则依据系统设置
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  // 切换主题
  const toggleTheme = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className="theme-toggle">
      <button 
        className={`theme-btn ${isDarkMode ? 'dark-mode-btn' : 'light-mode-btn'}`}
        onClick={toggleTheme}
        aria-label={isDarkMode ? "切换到亮色模式" : "切换到暗色模式"}
      >
        {isDarkMode ? (
          <svg className="theme-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        ) : (
          <svg className="theme-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        )}
      </button>

      <style jsx>{`
        .theme-toggle {
          z-index: 10;
        }
        .theme-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          color: white;
          border-radius: 50%;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
          position: relative;
          overflow: hidden;
        }
        .light-mode-btn {
          background-color: var(--ghibli-green);
        }
        .dark-mode-btn {
          background-color: var(--ghibli-blue);
        }
        .theme-btn::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          z-index: -1;
          background: ${isDarkMode 
            ? 'linear-gradient(45deg, var(--ghibli-blue), var(--ghibli-shadow-blue))' 
            : 'linear-gradient(45deg, var(--ghibli-green), var(--ghibli-soft-green))'};
          border-radius: 50%;
          opacity: 0.6;
          transition: all 0.3s ease;
        }
        .theme-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
        }
        .light-mode-btn:hover {
          background-color: var(--ghibli-green);
        }
        .dark-mode-btn:hover {
          background-color: var(--ghibli-shadow-blue);
        }
        .theme-btn:hover::before {
          opacity: 1;
        }
        .theme-icon {
          color: white;
          position: relative;
          z-index: 2;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
          transition: all 0.3s ease;
        }
        .theme-btn:hover .theme-icon {
          transform: ${isDarkMode ? 'rotate(45deg)' : 'rotate(-45deg)'};
        }
        
        @media (max-width: 768px) {
          .theme-btn {
            width: 36px;
            height: 36px;
          }
          
          .theme-icon {
            width: 16px;
            height: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default ThemeToggle; 