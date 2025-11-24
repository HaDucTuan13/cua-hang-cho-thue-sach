import { Table, Button, Space, Modal, Form, Input, InputNumber, Upload, Select, message } from 'antd';

import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

import { Editor } from '@tinymce/tinymce-react';

import styles from './ManagerProduct.module.scss';
import classNames from 'classnames/bind';
import {
    requestCreateProduct,
    requestGetProducts,
    requestUpdateProduct,
    requestUploadImages,
    requestDeleteImage,
    requestDeleteProduct,
} from '../../../../config/request';

import { useStore } from '../../../../hooks/useStore';

const cx = classNames.bind(styles);
const { Search } = Input;

function ManagerProduct() {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [editorContent, setEditorContent] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [loading, setLoading] = useState(false);

    const [categories, setCategories] = useState([]);

    const { category } = useStore();

    useEffect(() => {
        setCategories(category);
    }, [category]);

    // Fake data for demonstration
    const [products, setProducts] = useState([]);
    const fetchProducts = async () => {
        const products = await requestGetProducts();
        setProducts(products.metadata);
    };
    useEffect(() => {
        fetchProducts();
    }, []);

    // Filter products based on search keyword
    const filteredProducts = products.filter(
        (product) =>
            product.nameProduct.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            (product.description && product.description.toLowerCase().includes(searchKeyword.toLowerCase())),
    );

    const handleSearch = (value) => {
        setSearchKeyword(value);
    };

    const handleAdd = () => {
        setEditingProduct(null);
        form.resetFields();
        setFileList([]);
        setIsModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingProduct(record);

        // Ensure all form fields are set correctly
        form.setFieldsValue({
            nameProduct: record.nameProduct,
            price: record.price,
            stock: record.stock,
            category: record.category,
            description: record.description,
            publisher: record.publisher,
            publishingHouse: record.publishingHouse,
            coverType: record.coverType,
            id: record.id,
        });

        // Set images
        if (record.images) {
            const imageList = Array.isArray(record.images) ? record.images : record.images;

            setFileList(
                imageList.map((img, index) => ({
                    uid: `-${index}`,
                    name: `image-${index}`,
                    status: 'done',
                    url: img,
                })),
            );
        }

        setEditorContent(record.description || '');
        setIsModalOpen(true); // Make sure this is being called
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa sản phẩm "${record.nameProduct}"?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                await requestDeleteProduct({ id: record._id });
                await fetchProducts();
                message.success('Đã xóa sản phẩm');
            },
        });
    };

    const handleModalOk = async () => {
        setLoading(true);

        form.validateFields()
            .then(async (values) => {
                try {
                    let imageUrls = [];

                    // Lọc ra ảnh mới (có file gốc) và ảnh cũ (đã có URL)
                    const newImages = fileList.filter((file) => file.originFileObj);
                    const oldImageUrls = fileList
                        .filter((file) => !file.originFileObj && file.url)
                        .map((file) => file.url);

                    // Nếu có ảnh mới → upload
                    if (newImages.length > 0) {
                        const formData = new FormData();
                        newImages.forEach((file) => {
                            formData.append('images', file.originFileObj);
                        });

                        const resImages = await requestUploadImages(formData);

                        // Gộp ảnh cũ và ảnh upload mới
                        imageUrls = [...oldImageUrls, ...(resImages?.metadata || [])];
                    } else {
                        // Chỉ có ảnh cũ
                        imageUrls = [...oldImageUrls];
                    }

                    const data = {
                        ...values,
                        description: editorContent,
                        images: imageUrls,
                    };

                    // Gửi dữ liệu tạo hoặc cập nhật
                    if (editingProduct) {
                        data.id = editingProduct._id;
                        await requestUpdateProduct(data);
                    } else {
                        await requestCreateProduct(data);
                    }

                    // Làm mới UI
                    await fetchProducts();
                    form.resetFields();
                    setFileList([]);
                    setEditorContent('');
                    message.success(`${editingProduct ? 'Cập nhật' : 'Thêm'} sản phẩm thành công`);
                    setIsModalOpen(false);
                } catch (error) {
                    console.error('Error:', error);
                    message.error(`Lỗi khi ${editingProduct ? 'cập nhật' : 'thêm'} sản phẩm`);
                } finally {
                    setLoading(false);
                }
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
                message.error(info?.response?.data?.message || 'Dữ liệu không hợp lệ');
                setLoading(false);
            });
    };

    // Add this useEffect to debug modal state
    useEffect(() => {
        console.log('Modal state:', isModalOpen);
    }, [isModalOpen]);

    const columns = [
        {
            title: 'Ảnh sản phẩm',
            dataIndex: 'images',
            key: 'images',
            render: (images) => (
                <img
                    src={images[0]}
                    alt="Ảnh sản phẩm"
                    style={{ width: '100px', height: '100px', borderRadius: '10px' }}
                />
            ),
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'nameProduct',
            key: 'nameProduct',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `${price.toLocaleString('vi-VN')} VNĐ`,
        },

        {
            title: 'Kho',
            dataIndex: 'stock',
            key: 'stock',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                        Sửa
                    </Button>
                    <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    const uploadProps = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            return false; // Prevent auto upload
        },
        onChange: (info) => {
            setFileList(info.fileList);
        },
        fileList,
        multiple: true,
    };

    const handleRemoveImage = async (file, id) => {
        const data = {
            id,
            image: file.url,
        };
        await requestDeleteImage(data);
        await fetchProducts();
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <h2>Quản lý sản phẩm</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Thêm sản phẩm
                </Button>
            </div>

            <div className={cx('search-container')} style={{ marginBottom: '20px' }}>
                <Search
                    placeholder="Tìm kiếm sản phẩm..."
                    allowClear
                    enterButton
                    size="large"
                    onSearch={handleSearch}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ maxWidth: '500px' }}
                />
            </div>

            <Table columns={columns} dataSource={filteredProducts} rowKey="id" />

            <Modal
                title={editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={() => setIsModalOpen(false)}
                width={800}
                confirmLoading={loading}
            >
                <Form form={form} layout="vertical" className={cx('form')}>
                    <div className={cx('form-row')}>
                        <Form.Item
                            name="nameProduct"
                            label="Tên sản phẩm"
                            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="price"
                            label="Giá cọc"
                            rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value.replace(/(,*)/g, '')}
                            />
                        </Form.Item>
                    </div>

                    <div className={cx('form-row')}>
                        <Form.Item
                            name="category"
                            label="Danh mục"
                            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                        >
                            <Select>
                                {categories.map((item) => (
                                    <Select.Option key={item._id} value={item._id}>
                                        {item.nameCategory}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="stock"
                            label="Số lượng trong kho"
                            rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                        >
                            <InputNumber style={{ width: '100%' }} min={0} />
                        </Form.Item>
                    </div>

                    <div className={cx('form-row')}>
                        <Form.Item
                            name="publisher"
                            label="Công ty phát hành"
                            rules={[{ required: true, message: 'Vui lòng nhập công ty phát hành!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="publishingHouse"
                            label="Nhà xuất bản"
                            rules={[{ required: true, message: 'Vui lòng nhập nhà xuất bản!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>

                    <div className={cx('form-row')}>
                        <Form.Item
                            name="coverType"
                            label="Loại bìa"
                            rules={[{ required: true, message: 'Vui lòng chọn loại bìa!' }]}
                        >
                            <Select>
                                <Select.Option value="paperback">Bìa mềm</Select.Option>
                                <Select.Option value="hardcover">Bìa cứng</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                    >
                        <Editor
                            apiKey="hfm046cu8943idr5fja0r5l2vzk9l8vkj5cp3hx2ka26l84x"
                            init={{
                                plugins:
                                    'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                                toolbar:
                                    'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                            }}
                            initialValue="Mô tả chi tiết sản phẩm"
                            onEditorChange={(content, editor) => {
                                setEditorContent(content);
                                form.setFieldsValue({ description: content });
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="images"
                        label="Hình ảnh"
                        rules={[
                            {
                                required: !editingProduct,
                                message: 'Vui lòng tải lên ít nhất 1 hình ảnh!',
                            },
                        ]}
                    >
                        <Upload
                            {...uploadProps}
                            listType="picture-card"
                            onRemove={(file) => {
                                handleRemoveImage(file, editingProduct._id);
                            }}
                        >
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Tải ảnh</div>
                            </div>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default ManagerProduct;
