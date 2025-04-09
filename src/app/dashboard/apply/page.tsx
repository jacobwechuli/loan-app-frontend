// src/app/dashboard/apply/page.tsx
'use client';

import React, { useState, useEffect } from 'react'; // Removed useEffect
import { Form, Input, InputNumber, Button, Card, Typography, message, Spin } from 'antd';
// import { useRouter } from 'next/navigation'; // No longer needed for redirect
import { submitLoanApplication } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

const { Title } = Typography;
const { TextArea } = Input;

export default function ApplyLoanPage() {
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth(); // Get auth state
  const [form] = Form.useForm();

  // --- REMOVED TEMPORARY USER ID HANDLING ---

  const onFinish = async (values: any) => {
    // No need to check tempUserId, API call requires authentication header
    setLoading(true);
    message.loading({ content: 'Submitting application...', key: 'applyLoan' });
    try {
      // Call API without userId, backend gets it from token
      const response = await submitLoanApplication(values);
      message.success({ content: 'Application submitted successfully!', key: 'applyLoan', duration: 2 });
      console.log('Application Response:', response.data);
      form.resetFields();
    } catch (error: any) {
      console.error('Application submission failed:', error);
       const errorMsg = error.response?.data?.message || 'Submission failed. Please try again.';
       message.error({ content: errorMsg, key: 'applyLoan', duration: 4 });
    } finally {
      setLoading(false);
    }
  };

  // ... onFinishFailed ...
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    message.error('Please fill out the form correctly.');
  };

  return (
    <Card>
        <Spin spinning={loading}>
          <Title level={3} style={{ textAlign: 'center', marginBottom: '24px' }}>New Loan Application</Title>
          {/* Form remains mostly the same, disable check based on isAuthenticated */}
           {!isAuthenticated && <Typography.Text type="danger">Warning: You must be logged in to submit.</Typography.Text>}
          <Form
            form={form}
            name="loanApplication"
            onFinish={onFinish}
            // onFinishFailed={onFinishFailed} // Add if needed
            layout="vertical"
            style={{ maxWidth: 600, margin: '0 auto' }}
            disabled={!isAuthenticated || loading} // Disable if not authenticated or loading
          >
            {/* Form Items (requestedAmount, purpose) remain the same */}
            <Form.Item
              name="requestedAmount"
              label="Requested Loan Amount (KES)"
              rules={[{ required: true, message: 'Please input the loan amount!' }, { type: 'number', min: 1, message: 'Amount must be positive' }]}
            >
              <InputNumber style={{ width: '100%' }} prefix="KES" min={1} step={1000} />
            </Form.Item>

            <Form.Item
              name="purpose"
              label="Purpose of the Loan"
              rules={[{ required: true, message: 'Please describe the purpose!' }, { whitespace: true, max: 500 }]}
            >
              <TextArea rows={4} placeholder="E.g., Purchase seeds, fertilizer, irrigation equipment..." maxLength={500} showCount/>
            </Form.Item>

            <Form.Item style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit" disabled={loading || !isAuthenticated}>
                Submit Application
              </Button>
            </Form.Item>
          </Form>
        </Spin>
    </Card>
  );
}


 