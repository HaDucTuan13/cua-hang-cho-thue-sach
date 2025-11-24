import Header from '../Components/Header/Header';
import { Input, Button, Form } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import images from '../assets/images/imagesLogin.jpg';
import Footer from '../Components/Footer/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { requestLogin } from '../config/request';

import { message } from 'antd';
import { useEffect } from 'react';

function LoginUser() {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const res = await requestLogin(values);
            message.success(res.message);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            navigate('/');
        } catch (error) {
            message.error(error.response.data.message);
        }
    };

    useEffect(() => {
        document.title = 'Đăng nhập tài khoản';
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <header>
                <Header />
            </header>
            <main className="container mx-auto px-4 py-8">
                <div className="w-[80%] mx-auto bg-white rounded-lg shadow-md overflow-hidden h-[600px]">
                    <div className="flex h-full">
                        {/* Left Column - Image */}
                        <div className="w-1/2 bg-blue-600 relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-90">
                                <img src={images} alt="login" className="w-full h-full object-cover" />
                            </div>
                            <div className="relative h-full flex items-center justify-center p-8">
                                <div className="text-white text-center">
                                    <h2 className="text-3xl font-bold mb-4">Chào mừng trở lại!</h2>
                                    <p className="text-lg opacity-90">
                                        Đăng nhập để truy cập vào hệ thống quản lý thư viện của chúng tôi
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Login Form */}
                        <div className="w-1/2 p-8">
                            <h1 className="text-2xl font-bold text-center mb-2">Đăng nhập</h1>
                            <p className="text-sm text-gray-500 text-center mb-6">
                                Vui lòng đăng nhập để tiếp tục sử dụng dịch vụ của chúng tôi.
                            </p>

                            <Form name="login" onFinish={onFinish} layout="vertical" className="space-y-4">
                                <Form.Item
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập email của bạn!',
                                        },
                                        {
                                            type: 'email',
                                            message: 'Email không hợp lệ!',
                                        },
                                    ]}
                                >
                                    <Input
                                        prefix={<UserOutlined className="text-gray-400" />}
                                        placeholder="Email"
                                        size="large"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập mật khẩu của bạn!',
                                        },
                                    ]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined className="text-gray-400" />}
                                        placeholder="Mật khẩu"
                                        size="large"
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                        size="large"
                                    >
                                        Đăng nhập
                                    </Button>
                                </Form.Item>
                            </Form>
                            <Link to="/register" className="text-blue-500 text-center block mt-4 text-sm">
                                Bạn chưa có tài khoản ? Đăng ký ngay
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default LoginUser;
