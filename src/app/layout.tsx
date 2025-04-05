import React from "react";
import { AntdRegistry } from '@ant-design/nextjs-registry';

export const metadata = {
  title: 'Agri-Fintech Platform',
  description: 'Loan management for farmers',
};

export default function RootLayout({ children } : { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="dark:bg-gray-900 dark:text-white">
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  )