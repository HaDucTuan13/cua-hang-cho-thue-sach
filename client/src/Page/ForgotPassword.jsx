import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/Footer';
import { Input, Button, Form, message, Steps } from 'antd';
import { MailOutlined, LockOutlined, KeyOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import images from '../assets/images/imagesLogin.jpg';
import { requestForgotPassword, requestResetPassword } from '../config/request';
import cookies from 'js-cookie';

function ForgotPassword() {
    const [currentStep, setCurrentStep] = useState(0);
    const [email, setEmail] = useState('');
    const [form] = Form.useForm();

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Quên mật khẩu';
    }, []);

    useEffect(() => {
        const tokenResetPassword = cookies.get('tokenResetPassword');
        if (tokenResetPassword) {
            setCurrentStep(1);
        }
    }, []);

    const handleEmailSubmit = async (values) => {
        try {
            // Request to send OTP to email would be implemented here
            const res = await requestForgotPassword(values);
            console.log(res);
            setEmail(values.email);
            message.success('Mã OTP đã được gửi đến email của bạn!');
            setCurrentStep(1);
        } catch (error) {
            message.error('Có lỗi xảy ra. Vui lòng thử lại sau!');
        }
    };

    const handleResetPassword = async (values) => {
        try {
            // Request to verify OTP and reset password would be implemented here
            await requestResetPassword(values);
            message.success('Mật khẩu đã được đặt lại thành công!');
            navigate('/login');
            // You could redirect to login page here
        } catch (error) {
            message.error('Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng thử lại!');
        }
    };

    const renderStepContent = () => {
        if (currentStep === 0) {
            return (
                <>
                    <h1 className="text-2xl font-bold text-center mb-2">Khôi phục mật khẩu</h1>
                    <p className="text-sm text-gray-500 text-center mb-6">
                        Nhập email của bạn và chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu.
                    </p>

                    <Form
                        name="forgot-password-email"
                        onFinish={handleEmailSubmit}
                        layout="vertical"
                        className="space-y-4"
                    >
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
                                prefix={<MailOutlined className="text-gray-400" />}
                                placeholder="Email"
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
                                Gửi mã OTP
                            </Button>
                        </Form.Item>
                    </Form>
                </>
            );
        } else {
            return (
                <>
                    <h1 className="text-2xl font-bold text-center mb-2">Đặt lại mật khẩu</h1>
                    <p className="text-sm text-gray-500 text-center mb-6">
                        Nhập mã OTP đã được gửi đến <span className="font-medium">{email}</span> và mật khẩu mới của
                        bạn.
                    </p>

                    <Form
                        name="reset-password"
                        onFinish={handleResetPassword}
                        layout="vertical"
                        className="space-y-4"
                        form={form}
                    >
                        <Form.Item
                            name="otp"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mã OTP!',
                                },
                                {
                                    len: 6,
                                    message: 'Mã OTP phải có 6 chữ số!',
                                },
                            ]}
                        >
                            <Input
                                prefix={<KeyOutlined className="text-gray-400" />}
                                placeholder="Mã OTP"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="newPassword"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mật khẩu mới!',
                                },
                                {
                                    min: 6,
                                    message: 'Mật khẩu phải có ít nhất 6 ký tự!',
                                },
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-gray-400" />}
                                placeholder="Mật khẩu mới"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            dependencies={['newPassword']}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng xác nhận mật khẩu!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-gray-400" />}
                                placeholder="Xác nhận mật khẩu mới"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item>
                            <div className="flex gap-4">
                                <Button type="default" onClick={() => setCurrentStep(0)} size="large" className="w-1/2">
                                    Quay lại
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="w-1/2 bg-blue-600 hover:bg-blue-700"
                                    size="large"
                                >
                                    Đặt lại mật khẩu
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </>
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header>
                <Header />
            </header>
            <main className="container mx-auto px-4 py-8">
                <div className="w-[80%] mx-auto bg-white rounded-lg shadow-md overflow-hidden h-[650px]">
                    <div className="flex h-full">
                        {/* Left Column - Image */}
                        <div className="w-1/2 bg-blue-600 relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-90">
                                <img src={images} alt="forgot password" className="w-full h-full object-cover" />
                            </div>
                            <div className="relative h-full flex items-center justify-center p-8">
                                <div className="text-white text-center">
                                    <h2 className="text-3xl font-bold mb-4">Quên mật khẩu?</h2>
                                    <p className="text-lg opacity-90 mb-8">
                                        Đừng lo lắng! Chúng tôi sẽ giúp bạn khôi phục mật khẩu của mình.
                                    </p>

                                    <div className="w-3/4 mx-auto">
                                        <Steps
                                            current={currentStep}
                                            items={[
                                                {
                                                    title: <span className="text-white">Xác thực Email</span>,
                                                },
                                                {
                                                    title: <span className="text-white">Đặt lại mật khẩu</span>,
                                                },
                                            ]}
                                            progressDot
                                            className="custom-steps"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Form */}
                        <div className="w-1/2 p-8">
                            {renderStepContent()}

                            <div className="mt-6 text-center">
                                <Link to="/login" className="text-blue-500 hover:text-blue-700 text-sm">
                                    Quay lại đăng nhập
                                </Link>
                            </div>

                            <div className="mt-8 border-t pt-6">
                                <p className="text-sm text-gray-500 text-center">
                                    Bạn chưa có tài khoản?{' '}
                                    <Link to="/register" className="text-blue-500 hover:text-blue-700">
                                        Đăng ký ngay
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default ForgotPassword;
