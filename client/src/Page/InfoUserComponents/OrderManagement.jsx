import { useEffect, useState } from 'react';
import { Table, Tag, Button, Tabs, Badge, Modal, Timeline, Descriptions, message } from 'antd';
import { EyeOutlined, FileDoneOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { requestCancelOrder, requestGetPaymentByUserId } from '../../config/request';

import dayjs from 'dayjs';

const { TabPane } = Tabs;

const OrderManagement = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orders, setOrders] = useState([]);

    const columns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: '_id',
            key: '_id',
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (price) => price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = '';
                let text = '';

                switch (status) {
                    case 'completed':
                        color = 'green';
                        text = 'Hoàn thành';
                        break;
                    case 'processing':
                        color = 'blue';
                        text = 'Đang xử lý';
                        break;
                    case 'pending':
                        color = 'orange';
                        text = 'Chờ xác nhận';
                        break;
                    case 'cancelled':
                        color = 'red';
                        text = 'Đã huỷ';
                        break;
                    default:
                        color = 'default';
                        text = 'Không xác định';
                }

                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <div className="flex gap-2">
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => showOrderDetails(record)}
                        className="flex items-center bg-blue-500 hover:bg-blue-600"
                    >
                        Xem chi tiết
                    </Button>

                    {record.status === 'pending' && (
                        <Button
                            type="primary"
                            danger
                            icon={<FileDoneOutlined />}
                            size="small"
                            onClick={() => handleCancelOrder(record)}
                            className="flex items-center bg-red-500 hover:bg-red-600"
                        >
                            Huỷ đơn
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    const showOrderDetails = (order) => {
        setSelectedOrder(order);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const fetchOrders = async () => {
        const response = await requestGetPaymentByUserId();
        setOrders(response.metadata);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCancelOrder = async (order) => {
        try {
            await requestCancelOrder({ id: order._id });
            fetchOrders();
            message.success('Huỷ đơn hàng thành công');
        } catch (error) {
            message.error('Huỷ đơn hàng thất bại');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Quản lý đơn hàng</h2>

            <Tabs defaultActiveKey="all">
                <TabPane
                    tab={
                        <span>
                            <Badge count={orders.length} offset={[10, 0]}>
                                <span>Tất cả</span>
                            </Badge>
                        </span>
                    }
                    key="all"
                >
                    <Table columns={columns} dataSource={orders} rowKey="id" pagination={false} className="mt-4" />
                </TabPane>

                <TabPane
                    tab={
                        <span>
                            <ClockCircleOutlined /> Chờ xác nhận
                        </span>
                    }
                    key="pending"
                >
                    <Table
                        columns={columns}
                        dataSource={orders.filter((order) => order.status === 'pending')}
                        rowKey="id"
                        pagination={false}
                        className="mt-4"
                    />
                </TabPane>

                <TabPane
                    tab={
                        <span>
                            <FileDoneOutlined /> Đã hoàn thành
                        </span>
                    }
                    key="completed"
                >
                    <Table
                        columns={columns}
                        dataSource={orders.filter((order) => order.status === 'completed')}
                        rowKey="id"
                        pagination={false}
                        className="mt-4"
                    />
                </TabPane>
            </Tabs>

            <Modal
                title={`Chi tiết đơn hàng #${selectedOrder?._id}`}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={700}
            >
                {selectedOrder && (
                    <div>
                        <Descriptions bordered column={2} size="small" className="mb-6">
                            <Descriptions.Item label="Mã đơn hàng" span={2}>
                                #{selectedOrder._id}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày đặt">
                                {dayjs(selectedOrder.createdAt).format('DD/MM/YYYY HH:mm')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                {(() => {
                                    let color = '';
                                    let text = '';

                                    switch (selectedOrder.status) {
                                        case 'completed':
                                            color = 'green';
                                            text = 'Hoàn thành';
                                            break;
                                        case 'processing':
                                            color = 'blue';
                                            text = 'Đang xử lý';
                                            break;
                                        case 'pending':
                                            color = 'orange';
                                            text = 'Chờ xác nhận';
                                            break;
                                        case 'cancelled':
                                            color = 'red';
                                            text = 'Đã huỷ';
                                            break;
                                        default:
                                            color = 'default';
                                            text = 'Không xác định';
                                    }

                                    return <Tag color={color}>{text}</Tag>;
                                })()}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tổng tiền" span={2}>
                                {selectedOrder.totalPrice.toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                })}
                            </Descriptions.Item>
                        </Descriptions>

                        <h3 className="text-lg font-medium mb-2">Sản phẩm</h3>
                        <Table
                            dataSource={selectedOrder.products}
                            pagination={false}
                            size="small"
                            columns={[
                                {
                                    title: 'Sản phẩm',
                                    dataIndex: 'product',
                                    key: 'product',
                                    render: (product) => <div>{product.nameProduct}</div>,
                                },
                                {
                                    title: 'Số lượng',
                                    dataIndex: 'quantity',
                                    key: 'quantity',
                                    width: 100,
                                },
                                {
                                    title: 'Thành tiền',
                                    dataIndex: 'product',
                                    key: 'product',
                                    width: 150,
                                    render: (product) => product.price.toLocaleString() + ' VNĐ',
                                },
                            ]}
                            rowKey="product"
                            className="mb-6"
                        />

                        <h3 className="text-lg font-medium mb-2">Lịch sử đơn hàng</h3>
                        <Timeline className="mt-4">
                            {selectedOrder.products.map((item, index) => (
                                <Timeline.Item
                                    key={index}
                                    color={index === selectedOrder.products.length - 1 ? 'green' : 'blue'}
                                >
                                    <p className="mb-0">
                                        <strong>{item.product.nameProduct}</strong>
                                    </p>
                                    <p className="text-gray-500">
                                        {item.quantity} sản phẩm - {dayjs(item.startDate).format('DD/MM/YYYY')} -{' '}
                                        {dayjs(item.endDate).format('DD/MM/YYYY')}
                                    </p>
                                </Timeline.Item>
                            ))}
                        </Timeline>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default OrderManagement;
