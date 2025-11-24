import { useEffect, useState } from 'react';
import styles from './ManagerCategory.module.scss';
import classNames from 'classnames/bind';
import { Table, Button, Modal, Form, Input, Upload, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import {
    requestCreateCategory,
    requestDeleteCategory,
    requestGetCategory,
    requestUpdateCategory,
} from '../../../../config/request';

const cx = classNames.bind(styles);

function ManagerCategory() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [form] = Form.useForm();

    const [categories, setCategories] = useState([]);
    const [fileList, setFileList] = useState([]);
    const fetchCategories = async () => {
        const categories = await requestGetCategory();
        setCategories(categories.metadata);
    };
    useEffect(() => {
        fetchCategories();
    }, []);

    const columns = [
        {
            title: 'Tên danh mục',
            dataIndex: 'nameCategory',
            key: 'nameCategory',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setModalMode('edit');
                            setIsModalOpen(true);
                            form.setFieldsValue({
                                ...record,
                                id: record._id,
                            });
                        }}
                    >
                        Sửa
                    </Button>
                    <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)}>
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    // Sample data - replace with your actual data
    const data = categories;

    const handleDelete = (id) => {
        console.log(id);
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa danh mục này?',
            okText: 'Xóa',
            cancelText: 'Hủy',
            onOk: async () => {
                await requestDeleteCategory(id);
                message.success('Đã xóa danh mục thành công');
                await fetchCategories();
            },
        });
    };

    const handleSubmit = async (values) => {
        try {
            if (modalMode === 'add') {
                await requestCreateCategory(values);
                message.success('Đã tạo danh mục thành công');
                setIsModalOpen(false);
                form.resetFields();
                await fetchCategories();
            }
            if (modalMode === 'edit') {
                const data = {
                    nameCategory: values.name,
                    id: values.id,
                };
                await requestUpdateCategory(data);
                message.success('Đã cập nhật danh mục thành công');
                setIsModalOpen(false);
                form.resetFields();
                await fetchCategories();
            }
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            message.error('Có lỗi xảy ra!');
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <h2>Quản lý danh mục</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setModalMode('add');
                        setIsModalOpen(true);
                        form.resetFields();
                    }}
                >
                    Thêm danh mục
                </Button>
            </div>

            <Table columns={columns} dataSource={data} bordered className={cx('category-table')} />

            <Modal
                title={modalMode === 'add' ? 'Thêm danh mục' : 'Sửa danh mục'}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="id" hidden>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="Tên danh mục"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên danh mục!',
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên danh mục" />
                    </Form.Item>

                    <Form.Item className={cx('form-actions')}>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {modalMode === 'add' ? 'Thêm' : 'Lưu'}
                            </Button>
                            <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default ManagerCategory;
