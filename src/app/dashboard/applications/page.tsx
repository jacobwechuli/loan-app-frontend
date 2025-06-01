// src/app/dashboard/applications/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
// Import TableProps type from antd
import { Table, Tag, Typography, message, Spin, Alert, Button, type TableProps, Card } from 'antd';
import { getMyLoanApplications } from '@/services/api';
import { ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAuth } from '@/contexts/AuthContext';

const { Title } = Typography;

// Interface LoanApplication remains the same
interface LoanApplication {
    id: number;
    requestedAmount: number;
    purpose: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUBMITTED' | 'INFO_REQUESTED';
    createdAt: string;
    updatedAt: string;
    resultingLoanId?: number;
}

export default function ApplicationsListPage() {
    const [applications, setApplications] = useState<LoanApplication[]>([]);
    const [dataLoading, setDataLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

    const fetchApplications = useCallback(async () => {
        console.log('Fetch attempt - Auth state:', { isAuthenticated, isAuthLoading });
        if (!isAuthenticated) {
            console.log('Not authenticated, skipping fetch');
            setError("Authentication required.");
            return;
        }
        setDataLoading(true);
        setError(null);
        try {
            console.log('Starting API request...');
            const response = await getMyLoanApplications();
            console.log('Raw API Response:', response);
            
            // Check if response.data exists and is an array
            if (!response.data) {
                console.warn('Response data is undefined or null');
                setApplications([]);
                return;
            }
            
            const applicationsData = Array.isArray(response.data) ? response.data : [];
            console.log('Processed applications:', applicationsData);
            
            if (applicationsData.length === 0) {
                console.log('No applications found in response');
            }
            
            setApplications(applicationsData);
        } catch (err: any) {
            console.error("Failed to fetch applications:", err);
            console.error("Error details:", {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message,
                config: err.config
            });
            
            const errorMsg = err.response?.data?.message || err.message || 'Failed to load applications.';
            if (err.response?.status === 401 || err.response?.status === 403) {
                console.log("Authentication error detected");
                setError("Your session may have expired. Please log in again.");
            } else {
                setError(errorMsg);
            }
        } finally {
            setDataLoading(false);
        }
    }, [isAuthenticated, isAuthLoading]);

    useEffect(() => {
        console.log('Auth state changed:', { isAuthenticated, isAuthLoading });
        if (!isAuthLoading && isAuthenticated) {
            console.log('Fetching applications due to auth state change');
            fetchApplications();
        } else if (!isAuthLoading && !isAuthenticated) {
            console.log('Clearing applications due to not authenticated');
            setApplications([]);
        }
    }, [isAuthenticated, isAuthLoading, fetchApplications]);

    const handleRefresh = () => {
        fetchApplications();
    };

    // --- Define columns WITH EXPLICIT TYPE ---
    // Use TableProps<YourRecordType>['columns'] for accurate typing
    // Make sure you have: import type { TableProps } from 'antd';

// Define columns with explicit type
const columns: TableProps<LoanApplication>['columns'] = [
    {
        title: 'App ID',
        dataIndex: 'id',
        key: 'id',
        sorter: (a, b) => a.id - b.id,
    },
    {
        title: 'Requested Amount',
        dataIndex: 'requestedAmount',
        key: 'requestedAmount',
        render: (amount) => `KES ${amount ? amount.toLocaleString() : 'N/A'}`,
        sorter: (a, b) => a.requestedAmount - b.requestedAmount,
    },
    {
        title: 'Purpose',
        dataIndex: 'purpose',
        key: 'purpose',
        ellipsis: true,
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => {
            let color = 'default';
            switch (status) {
                case 'PENDING': case 'SUBMITTED': color = 'processing'; break;
                case 'APPROVED': color = 'success'; break;
                case 'REJECTED': color = 'error'; break;
                case 'INFO_REQUESTED': color = 'warning'; break;
            }
            return <Tag color={color}>{status?.toUpperCase() || 'UNKNOWN'}</Tag>;
        },
        filters: [
           { text: 'Submitted', value: 'SUBMITTED' },
           { text: 'Pending', value: 'PENDING' },
           { text: 'Approved', value: 'APPROVED' },
           { text: 'Rejected', value: 'REJECTED' },
           { text: 'Info Requested', value: 'INFO_REQUESTED' },
        ],
        // Use the specific union type for value here
        onFilter: (value, record) => {
            // Type assertion to make it safe
            const filterValue = value as LoanApplication['status'];
            return record.status === filterValue;
          },
    },
    {
        title: 'Date Submitted',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (date) => date ? dayjs(date).format('YYYY-MM-DD HH:mm') : 'N/A',
        sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
        title: 'Last Updated',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        render: (date) => date ? dayjs(date).format('YYYY-MM-DD HH:mm') : 'N/A',
        sorter: (a, b) => dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(),
    },
];
    

    // --- Conditional Rendering Logic ---
    // (renderContent function or direct conditional rendering as in previous example)
    const renderContent = () => {
        if (isAuthLoading) {
             return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" tip="Verifying session..." /></div>;
        }
        if (!isAuthenticated) {
             return <Alert message="Authentication Required" description="Please log in to view your loan applications." type="warning" showIcon />;
        }
        // User is authenticated, handle data loading/error/display
        if (dataLoading) {
            return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" tip="Loading applications..." /></div>;
        }
        if (error) {
             return <Alert message="Error Loading Data" description={error} type="error" showIcon />;
        }
         // Authenticated, not loading, no errors - show table or empty state
         if (applications.length === 0) {
              return (
                 <Typography.Paragraph style={{marginTop: '20px', textAlign: 'center'}}>
                     You have not submitted any loan applications yet.
                 </Typography.Paragraph>
             );
         }
         // Show the table
         return (
             <Table
                 columns={columns} // Pass the typed columns array
                 dataSource={applications}
                 rowKey="id"
                 pagination={{ pageSize: 10, showSizeChanger: true }}
                 scroll={{ x: 'max-content' }}
             />
         );
    };


    return (
        <Card>
            <Title level={3}>My Loan Applications</Title>
            <Button
                onClick={handleRefresh}
                icon={<ReloadOutlined />}
                style={{ marginBottom: 16 }}
                disabled={isAuthLoading || dataLoading || !isAuthenticated}
                loading={dataLoading}
            >
                Refresh
            </Button>

            <div style={{ marginTop: '16px' }}>
                 {renderContent()}
            </div>

        </Card>
    );
}