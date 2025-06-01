import axios from "axios";
import { error } from "console";
import { config } from "process";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
apiClient.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken');
        console.log('API Request Config:', {
            url: config.url,
            method: config.method,
            headers: config.headers,
            hasToken: !!token
        });
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
},
(error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
});
apiClient.interceptors.response.use(
    response => response, // Pass through successful responses
    error => {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
         // Unauthorized or Forbidden
         console.error("Authentication error:", error.response.data);
         // Check if running on client side
         if (typeof window !== 'undefined') {
              // Avoid infinite loops if the login page itself causes 401
              if (window.location.pathname !== '/login') {
                   // Clear potentially invalid token and redirect to login
                   localStorage.removeItem('authToken');
                   localStorage.removeItem('userInfo');
                   // Use window location as router might not be available here easily
                   window.location.href = '/login?sessionExpired=true'; // Redirect and maybe show message
               }
         }
      }
      return Promise.reject(error); // Important: Reject the promise so calling code can handle it
    }
  );
  export const loginUser = (credentials: any) => {
    return apiClient.post('/auth/login', credentials);
  };
export const registerUser = (userData: any) => {
    return apiClient.post('/users/register', userData);
};
export const getUserById = (userId: number | string) => {
    return apiClient.get(`/users/${userId}`);
};
export const submitLoanApplication = (applicationData: any) => {
    // Backend will extract userId from the authenticated principal
    return apiClient.post('/applications', applicationData); // Removed /user/{userId}
  };
  export const getLoanApplicationById = (applicationId: number | string) => {
    return apiClient.get(`/applications/${applicationId}`);
  };
  
export const getLoanApplicationsByUserId = (userId: number | string) => {
    return apiClient.get(`/applications/user/${userId}`);
};
export const getMyLoanApplications = () => {
    console.log('Making request to /applications/my');
    return apiClient.get('/applications/my')
        .then(response => {
            console.log('Applications API response:', {
                status: response.status,
                data: response.data,
                headers: response.headers
            });
            return response;
        })
        .catch(error => {
            console.error('Applications API error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            throw error;
        });
};
  
export default apiClient;