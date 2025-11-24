import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Typography, Tag, Spin, DatePicker, Button } from 'antd';
import { UserOutlined, ShoppingCartOutlined, DollarOutlined, EyeOutlined } from '@ant-design/icons';
import { Column, Pie } from '@ant-design/charts';
import styles from './DashBoard.module.scss';
import classNames from 'classnames/bind';
import { requestDashboard } from '../../../../config/request';

const { Title } = Typography;
const cx = classNames.bind(styles);

function DashBoard() {
    const [loading, setLoading] = useState(true);
    const [statistics, setStatistics] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalRevenue: 0,
        totalWatching: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [orderStats, setOrderStats] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const params = {};
                if (startDate) params.startDate = startDate.format('YYYY-MM-DD');
                if (endDate) params.endDate = endDate.format('YYYY-MM-DD');

                const response = await requestDashboard(params);
                const {
                    statistics: statsData,
                    recentOrders: ordersData,
                    topProducts: productsData,
                    orderStats: orderStatsData,
                    categoryStats: categoryStatsData,
                    orderStatusStats: orderStatusStatsData,
                } = response.metadata;

                // Log to debug the data structure
                console.log('Order stats data:', orderStatsData);

                // Set all dashboard data from single API call
                setStatistics(statsData);
                setRecentOrders(
                    ordersData.map((order) => ({
                        key: order.id,
                        ...order,
                    })),
                );
                setTopProducts(
                    productsData.map((product) => ({
                        key: product.id,
                        ...product,
                    })),
                );
                // Simply set the orderStats data directly - our backend formats it correctly
                console.log('Received orderStatsData:', orderStatsData);
                console.log('Received categoryStatsData:', categoryStatsData);
                console.log('Received orderStatusStatsData:', orderStatusStatsData);

                setOrderStats(orderStatsData || []);

                // Fix categoryStats data structure for the pie chart
                const formattedCategoryStats = Array.isArray(categoryStatsData)
                    ? categoryStatsData.map((item) => ({
                          ...item,
                          // Ensure we have the correct field name for the pie chart
                          category: item.name, // Add category field for better labeling
                      }))
                    : [];
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [startDate, endDate]);

    const orderColumns = [
        {
            title: 'ID',
            dataIndex: 'idPayment',
            key: 'idPayment',
            width: 100,
        },
        {
            title: 'Khách hàng',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (price) => `${price.toLocaleString('vi-VN')}đ`,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const getStatusConfig = (status) => {
                    switch (status) {
                        case 'pending':
                            return { color: 'orange', text: 'Đang chờ xử lý' };
                        case 'completed':
                            return { color: 'green', text: 'Hoàn thành' };
                        case 'delivered':
                            return { color: 'blue', text: 'Đã giao' };
                        case 'cancelled':
                            return { color: 'red', text: 'Đã hủy' };
                        default:
                            return { color: 'default', text: 'Không xác định' };
                    }
                };
                const { color, text } = getStatusConfig(status);
                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: 'Phương thức',
            dataIndex: 'typePayment',
            key: 'typePayment',
            render: (type) => {
                const colors = {
                    COD: 'blue',
                    Banking: 'green',
                    Momo: 'purple',
                };
                return <Tag color={colors[type]}>{type}</Tag>;
            },
        },
    ];

    const productColumns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'name',
            key: 'name',
        },

        {
            title: 'Số lượng bán',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (quantity) => quantity,
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `${price?.toLocaleString('vi-VN')}đ`,
        },
        {
            title: 'Tồn kho',
            dataIndex: 'stock',
            key: 'stock',
            render: (stock) => <Tag color={stock > 10 ? 'green' : stock > 5 ? 'orange' : 'red'}>{stock}</Tag>,
        },
    ];

    // Chart configuration
    const config = {
        data: Array.isArray(orderStats) ? orderStats : [],
        xField: 'date',
        yField: 'count',
        color: '#1890ff',
        label: {
            position: 'middle',
            style: {
                fill: '#FFFFFF',
                opacity: 0.6,
            },
        },
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: true,
                formatter: (text) => {
                    // Format the date for display
                    if (orderStats.length > 15) {
                        // For many days, show shorter format
                        const date = new Date(text);
                        return `${date.getDate()}/${date.getMonth() + 1}`;
                    }
                    return text;
                },
            },
        },
        scrollbar: {
            type: 'horizontal',
        },
        meta: {
            date: { alias: 'Ngày' },
            count: { alias: 'Số đơn hàng' },
        },
    };

    // Category pie chart configuration - FIXED

    if (loading) {
        return (
            <div className={cx('loading-container')}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className={cx('wrapper')}>
            <Title level={2}>Tổng quan</Title>
            <div style={{ marginBottom: 24 }}>
                <DatePicker
                    placeholder="Chọn ngày bắt đầu"
                    onChange={setStartDate}
                    style={{ marginRight: 8 }}
                    value={startDate}
                    format="DD/MM/YYYY"
                />
                <DatePicker
                    placeholder="Chọn ngày kết thúc"
                    onChange={setEndDate}
                    value={endDate}
                    format="DD/MM/YYYY"
                    style={{ marginRight: 8 }}
                    disabledDate={(current) => {
                        // Can't select days before the start date
                        return startDate && current && current < startDate.startOf('day');
                    }}
                />
                <Button
                    type="default"
                    onClick={() => {
                        setStartDate(null);
                        setEndDate(null);
                    }}
                >
                    Đặt lại
                </Button>
            </div>

            {/* Thống kê */}
            <Row gutter={[16, 16]} className={cx('statistics')}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic title="Tổng người dùng" value={statistics.totalUsers} prefix={<UserOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Tổng sản phẩm"
                            value={statistics.totalProducts}
                            prefix={<ShoppingCartOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Doanh thu"
                            value={statistics.totalRevenue}
                            prefix={<DollarOutlined />}
                            suffix="đ"
                            formatter={(value) => `${value.toLocaleString('vi-VN')}`}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Sản phẩm được theo dõi"
                            value={statistics.totalWatching}
                            prefix={<EyeOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Biểu đồ đơn hàng 7 ngày gần đây */}
            <Row gutter={[16, 16]} className={cx('order-chart')}>
                <Col xs={24}>
                    <Card title="Tổng quan đơn hàng">
                        <Column {...config} />
                    </Card>
                </Col>
            </Row>

            {/* Pie Charts */}

            {/* Bảng dữ liệu */}
            <Row gutter={[16, 16]} className={cx('data-tables')}>
                <Col xs={24} lg={12}>
                    <Card title="Đơn hàng gần đây">
                        <Table
                            columns={orderColumns}
                            dataSource={recentOrders}
                            pagination={false}
                            scroll={{ x: true }}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Sản phẩm bán chạy">
                        <Table
                            columns={productColumns}
                            dataSource={topProducts}
                            pagination={false}
                            scroll={{ x: true }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default DashBoard;
