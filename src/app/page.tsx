'use client';
import { Button, Space, Typography } from "antd";
import Link from "next/link";
import React from "react";

const { Title, Paragraph } = Typography;
export default function Home() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <Title level={2}>Welcome to the Agri-Fintech Platform</Title>
      <Paragraph>Apply for loans, track subsidies, and manage repayments easily</Paragraph>
      <Space size="large">
        <Link href="/register" passHref>
        <Button type="primary" size="large">Register</Button>
        </Link>
        <Link href="/login" passHref>
        <Button type="primary" size="large">Login</Button>
        </Link>
        <Link href="/dashboard" passHref>
        <Button type="primary" size="large">Go to Dashboard</Button>
        </Link>
      </Space>
    </div>
  );
}