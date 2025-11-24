import axios from 'axios';
import cookies from 'js-cookie';

const request = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
});

export const requestLogin = async (data) => {
    const res = await request.post('/api/users/login', data);
    return res.data;
};

export const requestRegister = async (data) => {
    const res = await request.post('/api/users/register', data);
    return res.data;
};

export const requestAuth = async (data) => {
    const res = await request.post('/api/users/auth', data);
    return res.data;
};

export const requestRefreshToken = async (data) => {
    const res = await request.post('/api/users/refresh-token', data);
    return res.data;
};

export const requestUpdateUser = async (data) => {
    const res = await request.post('/api/users/update', data);
    return res.data;
};

export const requestUpdatePassword = async (data) => {
    const res = await request.post('/api/users/update-password', data);
    return res.data;
};

export const requestUploadAvatar = async (data) => {
    const res = await request.post('/api/users/upload-avatar', data);
    return res.data;
};

export const requestForgotPassword = async (data) => {
    const res = await request.post('/api/users/forgot-password', data);
    return res.data;
};

export const requestResetPassword = async (data) => {
    const res = await request.post('/api/users/reset-password', data);
    return res.data;
};

export const requestLogout = async () => {
    const res = await request.post('/api/users/logout');
    return res.data;
};

/// category

export const requestCreateCategory = async (data) => {
    const res = await request.post('/api/category/create', data);
    return res.data;
};

export const requestDeleteCategory = async (id) => {
    const res = await request.post('/api/category/delete', { id });
    return res.data;
};

export const requestGetCategory = async () => {
    const res = await request.get('/api/category/get');
    return res.data;
};

export const requestUpdateCategory = async (data) => {
    const res = await request.post('/api/category/update', data);
    return res.data;
};

export const requestGetCategoryById = async (id) => {
    const res = await request.get(`/api/category/get-category-by-id`, { params: { id } });
    return res.data;
};

// product
export const requestCreateProduct = async (data) => {
    const res = await request.post('/api/product/create', data);
    return res.data;
};

export const requestGetProducts = async () => {
    const res = await request.get('/api/product/get-products');
    return res.data;
};

export const requestUploadImages = async (data) => {
    const res = await request.post('/api/product/upload-images', data);
    return res.data;
};

export const requestUpdateProduct = async (data) => {
    const res = await request.post('/api/product/update', data);
    return res.data;
};

export const requestDeleteImage = async (data) => {
    const res = await request.post('/api/product/delete-image', data);
    return res.data;
};

export const requestDeleteProduct = async (data) => {
    const res = await request.post('/api/product/delete-product', data);
    return res.data;
};

export const requestGetProductById = async (id) => {
    const res = await request.get(`/api/product/get-product-by-id`, { params: { id } });
    return res.data;
};

export const requestSearchProduct = async (data) => {
    const res = await request.get(`/api/product/search-product`, { params: data });
    return res.data;
};

export const requestAdmin = async () => {
    const res = await request.get('/api/users/admin');
    return res.data;
};

//// cart

export const requestCreateCart = async (data) => {
    const res = await request.post('/api/cart/create', data);
    return res.data;
};

export const requestGetCart = async () => {
    const res = await request.get('/api/cart/get');
    return res.data;
};

export const requestUpdateQuantity = async (data) => {
    const res = await request.put('/api/cart/update-quantity', data);
    return res.data;
};

export const requestDeleteItem = async (data) => {
    const res = await request.post('/api/cart/delete-item', data);
    return res.data;
};

export const requestUpdateInfoCart = async (data) => {
    const res = await request.post('/api/cart/update-info', data);
    return res.data;
};

/// payments
export const requestCreatePayment = async (data) => {
    const res = await request.post('/api/payments/create', data);
    return res.data;
};

export const requestGetPaymentById = async (id) => {
    const res = await request.get(`/api/payments/payment-success`, { params: { id } });
    return res.data;
};

export const requestGetPaymentByUserId = async () => {
    const res = await request.get('/api/payments/payment-by-user');
    return res.data;
};

export const requestCancelOrder = async (data) => {
    const res = await request.post('/api/payments/cancel-order', data);
    return res.data;
};

export const requestGetPaymentsAdmin = async () => {
    const res = await request.get('/api/payments/get-payments-admin');
    return res.data;
};

export const requestUpdateOrderStatus = async (data) => {
    const res = await request.post('/api/payments/update-order-status', data);
    return res.data;
};

/// view product
export const requestCreateViewProduct = async (data) => {
    const res = await request.post('/api/view-product/create', data);
    return res.data;
};

export const requestGetViewProduct = async () => {
    const res = await request.get('/api/view-product/get-view-product');
    return res.data;
};

// users

export const requestGetUsers = async () => {
    const res = await request.get('/api/users/get-users');
    return res.data;
};

export const requestUpdateRoleUser = async (data) => {
    const res = await request.post('/api/users/update-role-user', data);
    return res.data;
};

/// dashboard

export const requestDashboard = async (data) => {
    const res = await request.get('/api/users/get-dashboard', { params: data });
    return res.data;
};

export const requestGetOrderStats = async (data) => {
    const res = await request.get('/api/users/get-dashboard', { params: data });
    return res.data;
};

let isRefreshing = false;
let failedRequestsQueue = [];

request.interceptors.response.use(
    (response) => response, // Trả về nếu không có lỗi
    async (error) => {
        const originalRequest = error.config;

        // Nếu lỗi 401 (Unauthorized) hoặc 403 (Forbidden) và request chưa từng thử refresh
        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    // Gửi yêu cầu refresh token
                    const token = cookies.get('logged');
                    if (!token) {
                        localStorage.clear();
                        window.location.href = '/login';
                        return;
                    }
                    await requestRefreshToken();

                    // Xử lý lại tất cả các request bị lỗi 401/403 trước đó
                    failedRequestsQueue.forEach((req) => req.resolve());
                    failedRequestsQueue = [];
                } catch (refreshError) {
                    // Nếu refresh thất bại, đăng xuất
                    failedRequestsQueue.forEach((req) => req.reject(refreshError));
                    failedRequestsQueue = [];
                    localStorage.clear();
                    window.location.href = '/login'; // Chuyển về trang đăng nhập
                } finally {
                    isRefreshing = false;
                }
            }

            // Trả về một Promise để retry request sau khi token mới được cập nhật
            return new Promise((resolve, reject) => {
                failedRequestsQueue.push({
                    resolve: () => {
                        resolve(request(originalRequest));
                    },
                    reject: (err) => reject(err),
                });
            });
        }

        return Promise.reject(error);
    },
);
