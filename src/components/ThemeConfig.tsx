'use client';

import React from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { ThemeProvider } from '@/contexts/ThemeContext';

interface ThemeConfigProps {
  children: React.ReactNode;
}

const ThemeConfig: React.FC<ThemeConfigProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <ConfigProvider
        theme={{
          algorithm: antdTheme.defaultAlgorithm,
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeProvider>
  );
};

export default ThemeConfig; 