import { useState } from 'react';
import { Menu } from 'antd';
import { UserOutlined, OrderedListOutlined, EyeOutlined, CommentOutlined, LogoutOutlined } from '@ant-design/icons';
import { useStore } from '../../hooks/useStore';

const Sidebar = ({ onMenuSelect }) => {
    const [currentKey, setCurrentKey] = useState('account');

    const handleClick = (key) => {
        setCurrentKey(key);
        onMenuSelect(key);
    };

    const { dataUser } = useStore();

    return (
        <div className="w-full h-full bg-white shadow-md rounded-lg p-4">
            <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gray-200 mb-3 flex items-center justify-center overflow-hidden">
                    <img src={dataUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{dataUser.fullName || 'Người dùng'}</h3>
            </div>

            <Menu mode="inline" selectedKeys={[currentKey]} className="border-r-0">
                <Menu.Item key="account" icon={<UserOutlined />} onClick={() => handleClick('account')}>
                    Thông tin tài khoản
                </Menu.Item>
                <Menu.Item key="orders" icon={<OrderedListOutlined />} onClick={() => handleClick('orders')}>
                    Quản lý đơn hàng
                </Menu.Item>
                <Menu.Item key="viewed" icon={<EyeOutlined />} onClick={() => handleClick('viewed')}>
                    Sản phẩm đã xem
                </Menu.Item>
                <Menu.Item
                    key="logout"
                    icon={<LogoutOutlined />}
                    className="text-red-500"
                    onClick={() => handleClick('logout')}
                >
                    Đăng xuất
                </Menu.Item>
            </Menu>
        </div>
    );
};

export default Sidebar;
