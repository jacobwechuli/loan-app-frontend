// src/app/dashboard/page.tsx
'use client'; // Needed if using hooks or receiving props like tempUserId
import React from 'react';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

// Accept tempUserId if passed from layout
export default function DashboardHomePage({ tempUserId }: { tempUserId?: string | null }) {
  return (
    <div>
      <Title level={3}>Farmer Dashboard</Title>
      <Paragraph>Welcome back!</Paragraph>
      {tempUserId && <Paragraph>Currently operating as User ID: {tempUserId}</Paragraph>}
      <Paragraph>Use the menu on the left to navigate.</Paragraph>
      {/* Add summary widgets or stats here later */}
    </div>
  );
}