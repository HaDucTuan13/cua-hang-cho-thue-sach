import Header from '../Components/Header/Header';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import images from '../assets/images/imagesLogin.jpg';
import Footer from '../Components/Footer/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { requestRegister } from '../config/request';
import { useEffect } from 'react';

function Register() {
    const [form] = Form.useForm();

    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const res = await requestRegister(values);
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
        document.title = 'Đăng ký tài khoản';
    }, []);

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
                                <img src={images} alt="register" className="w-full h-full object-cover" />
                            </div>
                            <div className="relative h-full flex items-center justify-center p-8">
                                <div className="text-white text-center">
                                    <h2 className="text-3xl font-bold mb-4">Chào mừng!</h2>
                                    <p className="text-lg opacity-90">
                                        Đăng ký để trở thành thành viên của hệ thống quản lý thư viện của chúng tôi
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Register Form */}
                        <div className="w-1/2 p-8">
                            <h1 className="text-2xl font-bold text-center mb-2">Đăng ký tài khoản</h1>
                            <p className="text-sm text-gray-500 text-center mb-6">
                                Vui lòng điền thông tin để tạo tài khoản mới.
                            </p>

                            <Form
                                form={form}
                                name="register"
                                onFinish={onFinish}
                                layout="vertical"
                                className="space-y-4"
                            >
                                <Form.Item
                                    name="fullName"
                                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                                >
                                    <Input
                                        prefix={<UserOutlined className="text-gray-400" />}
                                        placeholder="Họ và tên"
                                        size="large"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="email"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập email!' },
                                        { type: 'email', message: 'Email không hợp lệ!' },
                                    ]}
                                >
                                    <Input
                                        prefix={<MailOutlined className="text-gray-400" />}
                                        placeholder="Email"
                                        size="large"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                                    ]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined className="text-gray-400" />}
                                        placeholder="Mật khẩu"
                                        size="large"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="confirmPassword"
                                    dependencies={['password']}
                                    rules={[
                                        { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Mật khẩu không khớp!'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined className="text-gray-400" />}
                                        placeholder="Xác nhận mật khẩu"
                                        size="large"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="phone"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                        { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' },
                                    ]}
                                >
                                    <Input
                                        prefix={<PhoneOutlined className="text-gray-400" />}
                                        placeholder="Số điện thoại"
                                        size="large"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="address"
                                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                                >
                                    <Input
                                        prefix={<HomeOutlined className="text-gray-400" />}
                                        placeholder="Địa chỉ"
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
                                        Đăng Ký
                                    </Button>
                                </Form.Item>
                            </Form>
                            <Link to="/login" className="text-blue-500 text-center block mt-4 text-sm">
                                Bạn đã có tài khoản? Đăng nhập ngay
                            </Link>
                            <Link to="/forgot-password" className="text-blue-500 text-center block mt-4 text-sm">
                                Quên mật khẩu?
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Register;
