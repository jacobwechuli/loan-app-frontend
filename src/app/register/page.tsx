// src/app/register/page.tsx
'use client'; // This component uses client-side hooks (useState, etc.)

import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Spin } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation'; // Use App Router's navigation hook
import Link from 'next/link';
import { registerUser } from '@/services/api'; // Adjust path if needed

const { Title } = Typography;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [form] = Form.useForm(); // Get form instance

  const onFinish = async (values: any) => {
    setLoading(true);
    message.loading({ content: 'Registering...', key: 'register' });
    try {
      // Exclude confirm password field if you added one
      const { confirm, ...registrationData } = values;
      const response = await registerUser(registrationData);
      message.success({ content: 'Registration successful! Redirecting to login...', key: 'register', duration: 2 });
      console.log('Registration Response:', response.data);
      // Redirect to login page after a short delay
      setTimeout(() => router.push('/login'), 2000);
    } catch (error: any) {
      console.error('Registration failed:', error);
      const errorMsg = error.response?.data?.message || 'Registration failed. Please try again.';
      message.error({ content: errorMsg, key: 'register', duration: 3 });
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    message.error('Please fill out the form correctly.');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400 }}>
        <Spin spinning={loading}>
          <Title level={3} style={{ textAlign: 'center', marginBottom: '24px' }}>Farmer Registration</Title>
          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="firstName"
              rules={[{ required: true, message: 'Please input your First Name!' }, { whitespace: true }]}
            >
              <Input prefix={<UserOutlined />} placeholder="First Name" />
            </Form.Item>

            <Form.Item
              name="lastName"
              rules={[{ required: true, message: 'Please input your Last Name!' }, { whitespace: true }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Last Name" />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your Email!' }, { type: 'email', message: 'The input is not valid E-mail!' }]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>

             <Form.Item
              name="phoneNumber"
              // Add rules if needed, e.g., pattern matching for specific country codes
               rules={[{ required: false }, {pattern: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, message: 'Invalid phone number format'}]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Phone Number (Optional)" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }, {min: 8, message: 'Password must be at least 8 characters!'}]}
              hasFeedback // Shows validation icon
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>

            {/* Optional: Confirm Password */}
            <Form.Item
              name="confirm"
              dependencies={['password']} // Depends on the password field
              hasFeedback
              rules={[
                { required: true, message: 'Please confirm your Password!' },
                ({ getFieldValue }) => ({ // Custom validator
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve(); // Passwords match
                    }
                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
            </Form.Item>


            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }} disabled={loading}>
                Register
              </Button>
            </Form.Item>
             <div style={{ textAlign: 'center' }}>
                Already have an account? <Link href="/login">Login here</Link>
             </div>
          </Form>
        </Spin>
      </Card>
    </div>
  );
}