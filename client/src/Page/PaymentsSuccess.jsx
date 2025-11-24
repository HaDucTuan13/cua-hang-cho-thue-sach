import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Footer from '../Components/Footer/Footer';
import Header from '../Components/Header/Header';
import { requestGetPaymentById } from '../config/request';
import {
    Result,
    Card,
    Table,
    Typography,
    Button,
    Spin,
    Descriptions,
    Tag,
    Divider,
    Row,
    Col,
    Timeline,
    Empty,
} from 'antd';
import {
    CheckCircleFilled,
    HomeOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    CreditCardOutlined,
    ClockCircleOutlined,
    ShoppingOutlined,
    GiftOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

function PaymentsSuccess() {
    const [paymentData, setPaymentData] = useState([]);
    const [loading, setLoading] = useState(true);

    const { id } = useParams();

    useEffect(() => {
        const fetchPaymentData = async () => {
            try {
                if (id) {
                    const response = await requestGetPaymentById(id);
                    setPaymentData(response.metadata);
                }
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu thanh toán:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentData();
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'gold';
            case 'completed':
                return 'green';
            case 'cancelled':
                return 'red';
            default:
                return 'blue';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'Đang chờ xử lý';
            case 'completed':
                return 'Hoàn thành';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    const getPaymentMethodText = (method) => {
        switch (method) {
            case 'cod':
                return 'Thanh toán khi nhận hàng';
            case 'credit':
                return 'Thẻ tín dụng';
            case 'bank':
                return 'Chuyển khoản ngân hàng';
            default:
                return method;
        }
    };

    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: ['product'],
            key: 'product',
            render: (product) => (
                <div className="flex items-center">
                    <GiftOutlined className="mr-2 text-blue-500" />
                    <Text strong>{product?.nameProduct}</Text>
                </div>
            ),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (quantity) => <Tag color="blue">{quantity}</Tag>,
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (date) => (
                <div className="flex items-center">
                    <ClockCircleOutlined className="mr-2 text-orange-500" />
                    {formatDate(date)}
                </div>
            ),
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (date) => (
                <div className="flex items-center">
                    <ClockCircleOutlined className="mr-2 text-green-500" />
                    {formatDate(date)}
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <header>
                <Header />
            </header>

            <main className="container mx-auto px-4 py-8 flex-grow">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Spin size="large" tip="Đang tải thông tin thanh toán..." />
                    </div>
                ) : paymentData ? (
                    <div className="max-w-4xl mx-auto">
                        <Result
                            icon={<CheckCircleFilled className="text-green-500 text-7xl animate-pulse" />}
                            status="success"
                            title={
                                <Title level={1} className="text-green-600">
                                    Thanh toán thành công!
                                </Title>
                            }
                            subTitle={
                                <div>
                                    <Text className="text-lg text-gray-600 block mb-2">Cảm ơn bạn đã thanh toán</Text>
                                    <Tag color="green" className="text-base py-1 px-3">
                                        Mã đơn hàng: #{id}
                                    </Tag>
                                </div>
                            }
                            className="bg-white shadow-sm rounded-lg border border-gray-100 p-6 mb-8"
                        />

                        <Row gutter={24} className="mb-8">
                            <Col xs={24} md={12}>
                                <Card
                                    title={
                                        <div className="flex items-center text-blue-600">
                                            <ShoppingOutlined className="mr-2" />
                                            <span>Thông tin đơn hàng</span>
                                        </div>
                                    }
                                    className="h-full shadow-md hover:shadow-lg transition-shadow border-blue-100"
                                    headStyle={{ backgroundColor: '#f0f7ff', borderBottom: '2px solid #e6f7ff' }}
                                >
                                    <Timeline
                                        items={[
                                            {
                                                color: 'blue',
                                                children: (
                                                    <div className="mb-3">
                                                        <Text strong className="text-blue-700 text-base">
                                                            Trạng thái đơn hàng
                                                        </Text>
                                                        <div className="mt-1">
                                                            <Tag
                                                                color={getStatusColor(paymentData.status)}
                                                                className="text-base py-1 px-3"
                                                            >
                                                                {getStatusText(paymentData.status)}
                                                            </Tag>
                                                        </div>
                                                    </div>
                                                ),
                                            },
                                            {
                                                color: 'orange',
                                                children: (
                                                    <div className="mb-3">
                                                        <Text strong className="text-blue-700 text-base">
                                                            Phương thức thanh toán
                                                        </Text>
                                                        <div className="mt-1 flex items-center">
                                                            <CreditCardOutlined className="mr-2" />
                                                            <Text>
                                                                {getPaymentMethodText(paymentData.paymentMethod)}
                                                            </Text>
                                                        </div>
                                                    </div>
                                                ),
                                            },
                                            {
                                                color: 'green',
                                                children: (
                                                    <div>
                                                        <Text strong className="text-blue-700 text-base">
                                                            Tổng thanh toán
                                                        </Text>
                                                        <div className="mt-1">
                                                            <Text strong className="text-2xl text-red-500">
                                                                {new Intl.NumberFormat('vi-VN', {
                                                                    style: 'currency',
                                                                    currency: 'VND',
                                                                }).format(paymentData.totalPrice)}
                                                            </Text>
                                                        </div>
                                                    </div>
                                                ),
                                            },
                                        ]}
                                    />
                                </Card>
                            </Col>

                            <Col xs={24} md={12}>
                                <Card
                                    title={
                                        <div className="flex items-center text-green-600">
                                            <EnvironmentOutlined className="mr-2" />
                                            <span>Thông tin khách hàng</span>
                                        </div>
                                    }
                                    className="h-full shadow-md hover:shadow-lg transition-shadow mt-4 md:mt-0 border-green-100"
                                    headStyle={{ backgroundColor: '#f0fff4', borderBottom: '2px solid #e6ffec' }}
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <div className="bg-blue-100 rounded-full p-2 mr-3">
                                                <HomeOutlined className="text-blue-600" />
                                            </div>
                                            <div>
                                                <Text type="secondary">Họ và tên</Text>
                                                <Paragraph strong className="mb-0">
                                                    {paymentData.fullName || 'Không có thông tin'}
                                                </Paragraph>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="bg-green-100 rounded-full p-2 mr-3">
                                                <PhoneOutlined className="text-green-600" />
                                            </div>
                                            <div>
                                                <Text type="secondary">Số điện thoại</Text>
                                                <Paragraph strong className="mb-0">
                                                    {paymentData.phone || 'Không có thông tin'}
                                                </Paragraph>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="bg-amber-100 rounded-full p-2 mr-3">
                                                <EnvironmentOutlined className="text-amber-600" />
                                            </div>
                                            <div>
                                                <Text type="secondary">Địa chỉ giao hàng</Text>
                                                <Paragraph strong className="mb-0">
                                                    {paymentData.address || 'Không có thông tin'}
                                                </Paragraph>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        </Row>

                        <Card
                            title={
                                <div className="flex items-center">
                                    <ShoppingOutlined className="mr-2 text-purple-600" />
                                    <span className="text-purple-600">Chi tiết sản phẩm</span>
                                </div>
                            }
                            className="my-6 shadow-md hover:shadow-lg transition-shadow border-purple-100"
                            headStyle={{ backgroundColor: '#f8f0ff', borderBottom: '2px solid #f3e8ff' }}
                        >
                            {paymentData.products && paymentData.products.length > 0 ? (
                                <Table
                                    dataSource={paymentData.products}
                                    columns={columns}
                                    rowKey={(record, index) => index}
                                    pagination={false}
                                    className="border border-purple-100 rounded-lg overflow-hidden"
                                    rowClassName="hover:bg-purple-50"
                                />
                            ) : (
                                <Empty description="Không có thông tin sản phẩm" />
                            )}

                            <Divider />

                            <div className="text-right">
                                <div className="flex justify-end items-center">
                                    <Text className="mr-4">Tổng tiền:</Text>
                                    <Title level={3} className="!text-red-500 !mb-0">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                            paymentData.totalPrice,
                                        )}
                                    </Title>
                                </div>
                            </div>
                        </Card>

                        <div className="mt-8 text-center">
                            <Button
                                type="primary"
                                size="large"
                                icon={<HomeOutlined />}
                                className="bg-gradient-to-r from-blue-500 to-blue-700 border-0 h-12 text-lg shadow-lg hover:shadow-xl transition-all"
                                onClick={() => (window.location.href = '/')}
                            >
                                Quay về trang chủ
                            </Button>
                        </div>
                    </div>
                ) : (
                    <Result
                        status="error"
                        title="Không tìm thấy thông tin thanh toán"
                        subTitle="Không thể truy xuất thông tin thanh toán. Vui lòng liên hệ bộ phận hỗ trợ."
                        extra={
                            <Button type="primary" onClick={() => (window.location.href = '/')} className="bg-blue-500">
                                Quay về trang chủ
                            </Button>
                        }
                        className="bg-white p-8 shadow-md rounded-lg"
                    />
                )}
            </main>

            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default PaymentsSuccess;
