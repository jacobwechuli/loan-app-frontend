// src/app/layout.tsx
import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { AuthProvider } from '@/contexts/AuthContext';
import ThemeConfig from '@/components/ThemeConfig';
import './globals.css';

export const metadata = {
  title: 'Agri-Fintech Platform',
  description: 'Loan management for farmers',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ThemeConfig>
            <AntdRegistry>{children}</AntdRegistry>
          </ThemeConfig>
        </AuthProvider>
      </body>
    </html>
  );
}