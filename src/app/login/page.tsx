// src/app/login/page.tsx
'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Spin, Alert } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth hook
import { loginUser } from '@/services/api'; // Import loginUser API call
import { useSearchParams } from 'next/navigation'; // To check for query params like sessionExpired

const { Title } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // Get login function from context
  const [form] = Form.useForm();
  const searchParams = useSearchParams(); // Get query parameters
  const sessionExpired = searchParams.get('sessionExpired');

  const onFinish = async (values: any) => {
    setLoading(true);
    message.loading({ content: 'Logging in...', key: 'login' });
    try {
      const response = await loginUser(values); // Call backend login API
      const { token, userId, email, roles } = response.data; // Extract data from response

      // Call the login function from AuthContext to update state and localStorage
      login(token, { id: userId, email, roles });

      // Success message is handled within the login context function now
      // message.success({ content: 'Login successful! Redirecting...', key: 'login', duration: 1 });
      // Redirect is handled within the login context function

    } catch (error: any) {
      console.error('Login failed:', error);
      // Use error message from backend if available, otherwise use default
      const errorMsg = error.response?.data?.message || error.message || 'Login failed. Please check your credentials.';
      message.error({ content: errorMsg, key: 'login', duration: 4 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400 }}>
        <Spin spinning={loading}>
          <Title level={3} style={{ textAlign: 'center', marginBottom: '24px' }}>Farmer Login</Title>
           {sessionExpired && (
                <Alert
                    message="Your session may have expired. Please log in again."
                    type="warning"
                    showIcon
                    style={{ marginBottom: '16px' }}
                />
            )}
          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
          >
            {/* Form items remain the same (Email, Password) */}
             <Form.Item
                  name="email"
                  rules={[{ required: true, message: 'Please input your Email!' }, { type: 'email' }]}
                >
                  <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }} disabled={loading}>
                Log in
              </Button>
            </Form.Item>
            <div style={{ textAlign: 'center' }}>
              Don't have an account? <Link href="/register">Register now</Link>
            </div>
          </Form>
        </Spin>
      </Card>
    </div>
  );
}