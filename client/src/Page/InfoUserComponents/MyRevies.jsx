import { List, Rate, Button, Avatar, Input, Modal, Form, Tabs } from 'antd';
import { StarOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { TabPane } = Tabs;
const { TextArea } = Input;

const MyReviews = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentReview, setCurrentReview] = useState(null);
    const [form] = Form.useForm();

    // Mock data for reviews
    const myReviews = [
        {
            id: 1,
            productId: 101,
            productName: 'Nhà Giả Kim',
            productImage: 'https://via.placeholder.com/60x80',
            rating: 5,
            content: 'Sách hay, nội dung ý nghĩa và sâu sắc. Rất đáng để đọc và suy ngẫm về hành trình của cuộc sống.',
            date: '20/06/2023',
        },
        {
            id: 2,
            productId: 102,
            productName: 'Đắc Nhân Tâm',
            productImage: 'https://via.placeholder.com/60x80',
            rating: 4,
            content:
                'Một cuốn sách kinh điển về phát triển bản thân. Nhiều bài học thực tế có thể áp dụng ngay vào cuộc sống.',
            date: '15/07/2023',
        },
        {
            id: 3,
            productId: 103,
            productName: 'Tư Duy Phản Biện',
            productImage: 'https://via.placeholder.com/60x80',
            rating: 3,
            content: 'Nội dung khá cơ bản, phù hợp cho người mới bắt đầu tìm hiểu về tư duy phản biện.',
            date: '05/08/2023',
        },
    ];

    const showModal = (review) => {
        setCurrentReview(review);
        form.setFieldsValue({
            rating: review.rating,
            content: review.content,
        });
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSubmit = (values) => {
        console.log('Updated review:', { ...currentReview, ...values });
        setIsModalVisible(false);
        // Normally would update the review here
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Nhận xét của tôi</h2>

            <Tabs defaultActiveKey="all">
                <TabPane tab="Tất cả nhận xét" key="all">
                    {myReviews.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">Bạn chưa có nhận xét nào.</div>
                    ) : (
                        <List
                            itemLayout="vertical"
                            dataSource={myReviews}
                            renderItem={(item) => (
                                <List.Item
                                    key={item.id}
                                    actions={[
                                        <Button
                                            key="edit"
                                            icon={<EditOutlined />}
                                            onClick={() => showModal(item)}
                                            type="text"
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            Sửa
                                        </Button>,
                                        <Button key="delete" icon={<DeleteOutlined />} danger type="text">
                                            Xóa
                                        </Button>,
                                    ]}
                                    className="border-b pb-4 hover:bg-gray-50 transition-colors rounded-lg px-4"
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.productImage} shape="square" size={60} />}
                                        title={
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                                <a href={`/product/${item.productId}`} className="text-lg font-medium">
                                                    {item.productName}
                                                </a>
                                                <span className="text-sm text-gray-500">{item.date}</span>
                                            </div>
                                        }
                                        description={
                                            <div className="flex items-center mt-1">
                                                <Rate disabled defaultValue={item.rating} className="text-sm" />
                                                <span className="ml-2 text-yellow-500">
                                                    <StarOutlined /> {item.rating}.0
                                                </span>
                                            </div>
                                        }
                                    />
                                    <div className="mt-3">{item.content}</div>
                                </List.Item>
                            )}
                        />
                    )}
                </TabPane>
                <TabPane tab="Đã đánh giá (5)" key="rated">
                    <List
                        itemLayout="vertical"
                        dataSource={myReviews.filter((r) => r.rating >= 3)}
                        renderItem={(item) => (
                            <List.Item
                                key={item.id}
                                actions={[
                                    <Button
                                        key="edit"
                                        icon={<EditOutlined />}
                                        onClick={() => showModal(item)}
                                        type="text"
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        Sửa
                                    </Button>,
                                    <Button key="delete" icon={<DeleteOutlined />} danger type="text">
                                        Xóa
                                    </Button>,
                                ]}
                                className="border-b pb-4 hover:bg-gray-50 transition-colors rounded-lg px-4"
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={item.productImage} shape="square" size={60} />}
                                    title={
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                            <a href={`/product/${item.productId}`} className="text-lg font-medium">
                                                {item.productName}
                                            </a>
                                            <span className="text-sm text-gray-500">{item.date}</span>
                                        </div>
                                    }
                                    description={
                                        <div className="flex items-center mt-1">
                                            <Rate disabled defaultValue={item.rating} className="text-sm" />
                                            <span className="ml-2 text-yellow-500">
                                                <StarOutlined /> {item.rating}.0
                                            </span>
                                        </div>
                                    }
                                />
                                <div className="mt-3">{item.content}</div>
                            </List.Item>
                        )}
                    />
                </TabPane>
            </Tabs>

            <Modal title="Sửa nhận xét" open={isModalVisible} onCancel={handleCancel} footer={null}>
                {currentReview && (
                    <Form form={form} layout="vertical" onFinish={handleSubmit}>
                        <div className="flex items-center mb-4">
                            <Avatar src={currentReview.productImage} shape="square" size={60} />
                            <div className="ml-3">
                                <h3 className="font-medium">{currentReview.productName}</h3>
                                <span className="text-sm text-gray-500">Ngày đánh giá: {currentReview.date}</span>
                            </div>
                        </div>

                        <Form.Item
                            name="rating"
                            label="Đánh giá"
                            rules={[{ required: true, message: 'Vui lòng chọn đánh giá!' }]}
                        >
                            <Rate />
                        </Form.Item>

                        <Form.Item
                            name="content"
                            label="Nội dung nhận xét"
                            rules={[{ required: true, message: 'Vui lòng nhập nội dung nhận xét!' }]}
                        >
                            <TextArea rows={4} placeholder="Nhập nhận xét của bạn" />
                        </Form.Item>

                        <Form.Item className="mb-0">
                            <div className="flex justify-end">
                                <Button onClick={handleCancel} className="mr-2">
                                    Hủy
                                </Button>
                                <Button type="primary" htmlType="submit" className="bg-blue-500 hover:bg-blue-600">
                                    Cập nhật
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </div>
    );
};

export default MyReviews;
