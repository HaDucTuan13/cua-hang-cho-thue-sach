import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BookOutlined } from '@ant-design/icons';
import Cardbody from '../Cardbody/Cardbody';
import { useStore } from '../../hooks/useStore';
import { requestGetCategoryById, requestGetProducts } from '../../config/request';

// Mảng màu ngẫu nhiên để gán cho category
const colorOptions = [
    {
        color: 'from-purple-500 to-pink-500',
        bgColor: 'bg-purple-50 hover:bg-purple-100',
        textColor: 'text-purple-600',
    },
    {
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'bg-blue-50 hover:bg-blue-100',
        textColor: 'text-blue-600',
    },
    {
        color: 'from-green-500 to-emerald-500',
        bgColor: 'bg-green-50 hover:bg-green-100',
        textColor: 'text-green-600',
    },
    {
        color: 'from-orange-500 to-red-500',
        bgColor: 'bg-orange-50 hover:bg-orange-100',
        textColor: 'text-orange-600',
    },
    {
        color: 'from-pink-500 to-rose-500',
        bgColor: 'bg-pink-50 hover:bg-pink-100',
        textColor: 'text-pink-600',
    },
    {
        color: 'from-indigo-500 to-purple-500',
        bgColor: 'bg-indigo-50 hover:bg-indigo-100',
        textColor: 'text-indigo-600',
    },
    {
        color: 'from-gray-500 to-slate-500',
        bgColor: 'bg-gray-50 hover:bg-gray-100',
        textColor: 'text-gray-600',
    },
];

function HomePage() {
    const { category } = useStore(); // Dữ liệu từ API
    const [styledCategories, setStyledCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [priceFilter, setPriceFilter] = useState({ min: 0, max: Infinity });
    const [sortOrder, setSortOrder] = useState('');

    // Gán màu ngẫu nhiên cho mỗi category khi có data
    useEffect(() => {
        if (category.length > 0) {
            const styled = category.map((cat) => {
                const randomStyle = colorOptions[Math.floor(Math.random() * colorOptions.length)];
                return {
                    ...cat,
                    icon: <BookOutlined />,
                    count: cat.products.length || Math.floor(Math.random() * 1000 + 100), // fallback nếu không có count
                    ...randomStyle,
                };
            });
            setStyledCategories(styled);
        }
    }, [category]);

    const fetchProducts = async () => {
        const products = await requestGetProducts();
        setProducts(products.metadata);
        setFilteredProducts(products.metadata);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchCategoryById = async (id) => {
        const category = await requestGetCategoryById(id);
        setProducts(category.metadata.products);
        setFilteredProducts(category.metadata.products);
    };

    useEffect(() => {
        if (selectedCategory) {
            fetchCategoryById(selectedCategory);
        }
    }, [selectedCategory]);

    // Lọc sản phẩm theo giá và sắp xếp
    useEffect(() => {
        let result = [...products];

        // Lọc theo khoảng giá
        result = result.filter((product) => product.price >= priceFilter.min && product.price <= priceFilter.max);

        // Sắp xếp theo option đã chọn
        if (sortOrder === 'price-asc') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'price-desc') {
            result.sort((a, b) => b.price - a.price);
        } else if (sortOrder === 'newest') {
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortOrder === 'bestseller') {
            result.sort((a, b) => (b.sold || 0) - (a.sold || 0));
        }

        setFilteredProducts(result);
    }, [products, priceFilter, sortOrder]);

    // Xử lý khi thay đổi bộ lọc giá
    const handlePriceFilterChange = (type, value) => {
        setPriceFilter((prev) => ({
            ...prev,
            [type]: value === '' ? (type === 'min' ? 0 : Infinity) : Number(value),
        }));
    };

    // Xử lý thay đổi sắp xếp
    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    return (
        <div className="w-[95%] mx-auto grid grid-cols-12 gap-6 py-6">
            {/* Sidebar */}
            <div className="col-span-12 lg:col-span-3">
                <div className="sticky top-6 space-y-6">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                                    <BookOutlined className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Danh mục sách</h3>
                                    <p className="text-blue-100 text-sm">Khám phá thế giới tri thức</p>
                                </div>
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="p-4 space-y-2">
                            {styledCategories.map((cat) => (
                                <div
                                    key={cat._id}
                                    className={`group relative overflow-hidden rounded-xl p-4 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                                        cat.bgColor
                                    } ${selectedCategory === cat._id ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}
                                    onClick={() => setSelectedCategory(selectedCategory === cat._id ? null : cat._id)}
                                >
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-r ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                                    />
                                    <div className="relative flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`p-2 rounded-lg ${
                                                    cat.bgColor.split(' ')[0]
                                                } transition-all group-hover:scale-110`}
                                            >
                                                <span className={`text-lg ${cat.textColor}`}>{cat.icon}</span>
                                            </div>
                                            <div>
                                                <span
                                                    className={`font-medium ${cat.textColor} group-hover:font-semibold`}
                                                >
                                                    {cat.nameCategory}
                                                </span>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {cat.products.length.toLocaleString()} cuốn
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className={`transform transition-all duration-300 ${
                                                selectedCategory === cat._id ? 'rotate-90' : ''
                                            } ${cat.textColor}`}
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <div
                                        className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${cat.color} transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bộ lọc giá */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 text-white">
                            <h3 className="text-lg font-bold">Lọc theo giá</h3>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Giá tối thiểu</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={priceFilter.min === 0 ? '' : priceFilter.min}
                                    onChange={(e) => handlePriceFilterChange('min', e.target.value)}
                                    placeholder="0 đ"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Giá tối đa</label>
                                <input
                                    type="number"
                                    min={priceFilter.min}
                                    value={priceFilter.max === Infinity ? '' : priceFilter.max}
                                    onChange={(e) => handlePriceFilterChange('max', e.target.value)}
                                    placeholder="Không giới hạn"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div className="pt-2">
                                <button
                                    onClick={() => setPriceFilter({ min: 0, max: Infinity })}
                                    className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition duration-200"
                                >
                                    Đặt lại
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="col-span-12 lg:col-span-9">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {selectedCategory
                                    ? styledCategories.find((c) => c._id === selectedCategory)?.nameCategory ||
                                      'Sản phẩm nổi bật'
                                    : 'Tất cả sản phẩm'}
                            </h2>
                            <p className="text-gray-500 mt-1">
                                Hiển thị {filteredProducts.length} trong số {products.length} sản phẩm
                            </p>
                        </div>
                        <div>
                            <select
                                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={handleSortChange}
                                value={sortOrder}
                            >
                                <option value="">Sắp xếp theo</option>
                                <option value="price-asc">Giá thấp đến cao</option>
                                <option value="price-desc">Giá cao đến thấp</option>
                                <option value="newest">Mới nhất</option>
                                <option value="bestseller">Bán chạy</option>
                            </select>
                        </div>
                    </div>

                    {/* Sản phẩm */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <Link
                                    key={product._id}
                                    to={`/product/${product._id}`}
                                    className="transform hover:scale-105 transition-transform duration-200"
                                >
                                    <Cardbody product={product} />
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full py-8 text-center">
                                <p className="text-lg text-gray-500">Không tìm thấy sản phẩm phù hợp với bộ lọc</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
