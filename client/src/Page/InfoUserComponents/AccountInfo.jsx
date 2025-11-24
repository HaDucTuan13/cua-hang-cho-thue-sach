import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined, UserOutlined, PhoneOutlined, HomeOutlined, MailOutlined } from '@ant-design/icons';

import { useStore } from '../../hooks/useStore';
import { useEffect } from 'react';
import { requestUpdatePassword, requestUpdateUser, requestUploadAvatar } from '../../config/request';

const AccountInfo = () => {
    const [form] = Form.useForm();

    const { dataUser, fetchAuth } = useStore();

    useEffect(() => {
        document.title = 'Thông tin tài khoản';
    }, []);

    const onFinish = async (values) => {
        try {
            const data = {
                fullName: values.name,
                phone: values.phone,
                address: values.address,
            };
            const res = await requestUpdateUser(data);
            message.success(res.message);
            await fetchAuth();
        } catch (error) {
            message.error(error.response.data.message);
        }
    };

    const onFinishPassword = async (values) => {
        try {
            const data = {
                oldPassword: values.currentPassword,
                newPassword: values.newPassword,
            };
            const res = await requestUpdatePassword(data);
            message.success(res.message);
            await fetchAuth();
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            message.error(error.response.data.message);
        }
    };

    useEffect(() => {
        if (dataUser) {
            form.setFieldsValue({
                name: dataUser.fullName,
                email: dataUser.email,
                phone: dataUser.phone,
                address: dataUser.address,
                avatar: dataUser.avatar
                    ? dataUser.avatar
                    : 'https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg',
            });
        }
    }, [dataUser]);

    const handleUploadAvatar = async (file) => {
        try {
            const formData = new FormData();
            formData.append('avatar', file);
            const res = await requestUploadAvatar(formData);
            message.success(res.message);
            window.location.reload();
        } catch (error) {
            message.error(error.response.data.message);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Thông tin tài khoản</h2>

            <div className="flex mb-6">
                <div className="mr-8">
                    <div className="w-40 h-40 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                        <img src={dataUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <Upload maxCount={1} beforeUpload={handleUploadAvatar} className="mt-4">
                        <Button icon={<UploadOutlined />} className="w-full">
                            Thay đổi ảnh đại diện
                        </Button>
                    </Upload>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        name: 'Nguyễn Văn A',
                        email: 'nguyenvana@example.com',
                        phone: '0123456789',
                        address: 'Hà Nội, Việt Nam',
                    }}
                    onFinish={onFinish}
                    className="flex-1"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            name="name"
                            label="Họ và tên"
                            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                        >
                            <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Họ và tên" />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' },
                            ]}
                        >
                            <Input disabled prefix={<MailOutlined className="text-gray-400" />} placeholder="Email" />
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                        >
                            <Input prefix={<PhoneOutlined className="text-gray-400" />} placeholder="Số điện thoại" />
                        </Form.Item>

                        <Form.Item
                            name="address"
                            label="Địa chỉ"
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                        >
                            <Input prefix={<HomeOutlined className="text-gray-400" />} placeholder="Địa chỉ" />
                        </Form.Item>
                    </div>

                    <Form.Item className="mb-0 mt-4">
                        <Button type="primary" htmlType="submit" className="bg-blue-500 hover:bg-blue-600">
                            Lưu thay đổi
                        </Button>
                    </Form.Item>
                </Form>
            </div>

            <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-medium mb-4 text-gray-700">Thay đổi mật khẩu</h3>
                <Form layout="vertical" onFinish={onFinishPassword}>
                    <div className="grid grid-cols-3 gap-4">
                        <Form.Item
                            name="currentPassword"
                            label="Mật khẩu hiện tại"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                        >
                            <Input.Password placeholder="Mật khẩu hiện tại" />
                        </Form.Item>

                        <Form.Item
                            name="newPassword"
                            label="Mật khẩu mới"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
                        >
                            <Input.Password placeholder="Mật khẩu mới" />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            label="Xác nhận mật khẩu"
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
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
                            <Input.Password placeholder="Xác nhận mật khẩu" />
                        </Form.Item>
                    </div>

                    <Form.Item className="mb-0">
                        <Button type="primary" htmlType="submit" className="bg-blue-500 hover:bg-blue-600">
                            Cập nhật mật khẩu
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default AccountInfo;
