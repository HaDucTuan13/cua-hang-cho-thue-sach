import React, { useEffect, useState } from 'react';
import { Search, ShoppingCart, User, ChevronDown, LogOut, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { useStore } from '../../hooks/useStore';
import { requestLogout, requestSearchProduct } from '../../config/request';

import useDeboune from '../../hooks/useDebounce';

function Header() {
    const [searchText, setSearchText] = useState('');
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const debouncedSearch = useDeboune(searchText, 500);

    const navigatePage = useNavigate();

    const navigate = (path) => {
        navigatePage(path);
    };

    const { dataUser, dataCart } = useStore();

    const handleLogout = async () => {
        try {
            const res = await requestLogout();
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
        setSearchText('');
        setShowSearchResults(false);
    };

    useEffect(() => {
        const fetchSearchResult = async () => {
            if (debouncedSearch.trim()) {
                const res = await requestSearchProduct({ nameProduct: debouncedSearch });
                setSearchResult(res.metadata);
                setShowSearchResults(true);
            } else {
                setSearchResult([]);
                setShowSearchResults(false);
            }
        };
        fetchSearchResult();
    }, [debouncedSearch]);

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setShowSearchResults(false);
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <header className="w-full bg-white shadow-lg flex justify-center sticky top-0 z-50">
            <div className="w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/">
                        <div className="flex-shrink-0 cursor-pointer">
                            <img
                                src="https://doanwebsite.com/assets/logo-UOwfYMBw.webp"
                                alt="logo"
                                className="h-12 w-auto hover:scale-105 transition-transform duration-200"
                            />
                        </div>
                    </Link>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-2xl mx-8">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm sách..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (searchResult.length > 0) {
                                        setShowSearchResults(true);
                                    }
                                }}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-all duration-200 text-sm"
                            />

                            {/* Search Results Dropdown */}
                            {showSearchResults && searchResult.length > 0 && (
                                <div
                                    className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 max-h-96 overflow-y-auto z-50"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="p-2">
                                        <h3 className="text-sm font-medium text-gray-500 mb-2 px-2">
                                            Kết quả tìm kiếm
                                        </h3>
                                        <div className="space-y-2">
                                            {searchResult.map((product) => (
                                                <div
                                                    key={product._id}
                                                    onClick={() => handleProductClick(product._id)}
                                                    className="flex items-center p-2 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors duration-150"
                                                >
                                                    <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded overflow-hidden">
                                                        {product.images && product.images.length > 0 && (
                                                            <img
                                                                src={product.images[0]}
                                                                alt={product.nameProduct}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="ml-3 flex-1">
                                                        <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                                            {product.nameProduct}
                                                        </p>
                                                        <p className="text-sm text-red-600 font-medium">
                                                            {product.price.toLocaleString()} đ
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-6">
                        {dataUser._id && (
                            <Link to="/cart">
                                <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group">
                                    <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                                    <span className="font-medium hidden sm:block">
                                        Giỏ hàng ({dataCart?.length || 0})
                                    </span>
                                </button>
                            </Link>
                        )}

                        {/* User Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                            >
                                <User className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                                <span className="font-medium hidden sm:block">
                                    {dataUser?.id ? dataUser.fullName : 'Tài khoản'}
                                </span>
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform duration-200 ${
                                        isUserMenuOpen ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>

                            {/* Dropdown Menu */}
                            {isUserMenuOpen && (
                                <>
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        {dataUser?._id ? (
                                            // Menu khi đã đăng nhập
                                            <>
                                                <div className="px-4 py-3 border-b border-gray-100">
                                                    <p className="text-sm text-gray-500">Xin chào</p>
                                                    <p className="font-medium text-gray-900 truncate">
                                                        {dataUser.fullName || dataUser.email || 'Người dùng'}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        navigate('/info-user');
                                                        setIsUserMenuOpen(false);
                                                    }}
                                                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 font-medium flex items-center space-x-2"
                                                >
                                                    <User className="w-4 h-4" />
                                                    <span>Hồ sơ cá nhân</span>
                                                </button>
                                                <hr className="my-2 border-gray-100" />
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium flex items-center space-x-2"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    <span>Đăng xuất</span>
                                                </button>
                                            </>
                                        ) : (
                                            // Menu khi chưa đăng nhập
                                            <>
                                                <button
                                                    onClick={() => {
                                                        navigate('/login');
                                                        setIsUserMenuOpen(false);
                                                    }}
                                                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 font-medium"
                                                >
                                                    Đăng nhập
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        navigate('/register');
                                                        setIsUserMenuOpen(false);
                                                    }}
                                                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 font-medium"
                                                >
                                                    Đăng ký
                                                </button>
                                            </>
                                        )}
                                    </div>
                                    {/* Overlay */}
                                    <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
