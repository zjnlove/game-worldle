'use client';

import { store, persistor } from '../store/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { useEffect } from 'react';
import { initI18n } from '../i18n/i18n-utils';

export function Providers({ children }) {
  // 在客户端初始化国际化
  useEffect(() => {
    const locale = document.documentElement.lang || 'en';
    initI18n(locale);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
} 