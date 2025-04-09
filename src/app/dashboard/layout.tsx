// src/app/dashboard/layout.tsx
'use client';

import React, { useState } from 'react'; // Removed useEffect
import { Layout, Menu, Button, theme, Typography, message } from 'antd'; // Removed Input
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LogoutOutlined,
   // MenuFoldOutlined, MenuUnfoldOutlined // Could use these for collapse button
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Removed useRouter here, using context logout
import ProtectedRoute from '@/components/ProtectedRoute'; // Import ProtectedRoute
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth(); // Get user info and logout function from context
  const pathname = usePathname();

  // --- REMOVED TEMPORARY USER ID HANDLING ---

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const getSelectedKey = () => {
    if (pathname === '/dashboard/apply') return '1';
    if (pathname === '/dashboard/applications') return '2';
    return '1';
  };

  // Logout is now handled by context's logout function
  // const handleLogout = () => { ... } // Removed

  return (
    // Wrap the entire Layout inside ProtectedRoute
    <ProtectedRoute>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          {/* Sider content remains similar */}
           <div style={{ height: '32px', margin: '16px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '6px', textAlign: 'center', color: 'white', lineHeight: '32px' }}>
             {collapsed ? 'AFT' : 'AgriFintech'}
           </div>
           <Menu
             theme="dark"
             mode="inline"
             selectedKeys={[getSelectedKey()]}
             items={[
               { key: '1', icon: <UploadOutlined />, label: <Link href="/dashboard/apply">Apply for Loan</Link> },
               { key: '2', icon: <VideoCameraOutlined />, label: <Link href="/dashboard/applications">My Applications</Link> },
               { key: '3', icon: <UserOutlined />, label: 'My Profile', disabled: true },
               { type: 'divider' },
               { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', onClick: logout }, // Use context logout
             ]}
           />
        </Sider>
        <Layout>
          <Header style={{ padding: '0 16px', background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <Button
                type="text"
                icon={collapsed ? <UserOutlined/> : <UserOutlined/>} // Use appropriate icons later MenuUnfold/MenuFold
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: '16px', width: 64, height: 64 }}
            />
            {/* Display logged-in user email */}
             <div>
               {user ? <Text>Welcome, {user.email}</Text> : <Text>Loading...</Text>}
             </div>
             {/* --- REMOVED TEMPORARY USER ID INPUT --- */}
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
             {/* Children pages are rendered here, wrapped by ProtectedRoute */}
            {children}
          </Content>
        </Layout>
      </Layout>
    </ProtectedRoute>
  );
}