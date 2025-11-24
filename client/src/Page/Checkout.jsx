import React, { useEffect, useState } from 'react';
import { CheckCircle, HelpCircle, Truck, CreditCard, Smartphone, Banknote, User, MapPin, Phone } from 'lucide-react';
import Header from '../Components/Header/Header';
import { Link } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { requestUpdateInfoCart, requestCreatePayment } from '../config/request';
import { message } from 'antd';

function Checkout() {
    const { dataCart } = useStore();
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        phone: '',
        address: '',
    });

    const [typePayment, setTypePayment] = useState('cod');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        const fetchInfoCart = async () => {
            const data = {
                fullName: customerInfo.name,
                phone: customerInfo.phone,
                address: customerInfo.address,
            };
            await requestUpdateInfoCart(data);
        };
        fetchInfoCart();
    }, [customerInfo.name, customerInfo.phone, customerInfo.address]);

    const handleCreatePayment = async () => {
        const data = {
            typePayment: typePayment,
        };
        try {
            if (typePayment == 'cod') {
                await requestCreatePayment(data);
                message.success('Tạo đơn hàng thành công');
            } else if (typePayment === 'momo') {
                const res = await requestCreatePayment(data);
                window.open(res.metadata, '_blank');
            } else if (typePayment === 'vnpay') {
                const res = await requestCreatePayment(data);
                window.open(res.metadata, '_blank');
            }
        } catch (error) {
            message.error(error.response.data.message);
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <header>
                <Header />
            </header>

            <main className="w-[90%] bg-white mt-2.5 mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Thanh toán</h1>
                    <p className="text-gray-600">Hoàn tất đơn hàng của bạn</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Delivery and Payment */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Delivery Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {dataCart.map((item) => (
                                <div className="p-2">
                                    <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-4">
                                        <div className="border-t border-gray-200 pt-4">
                                            <div className="flex space-x-4">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={item.product.images[0]}
                                                        alt="Book cover"
                                                        className="w-16 h-20 object-cover rounded-lg shadow-sm"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                                                        {item.product.nameProduct}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 mb-2">SL: {item.quantity}</p>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-red-600 font-semibold">
                                                            {item.product.price.toLocaleString()}đ
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Customer Information Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 bg-gradient-to-r from-violet-50 to-purple-50 border-b border-gray-100">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-violet-100 rounded-full">
                                        <User className="w-5 h-5 text-violet-600" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900">Thông tin người nhận</h2>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="space-y-6">
                                    {/* Name Field */}
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="text-sm font-medium text-gray-700 block mb-1.5"
                                        >
                                            Họ và tên <span className="text-red-500">*</span>
                                        </label>
                                        <div className="group relative transition-all duration-300">
                                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-violet-500 transition-colors">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                value={customerInfo.name}
                                                onChange={handleInputChange}
                                                className="w-full px-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all duration-300"
                                                placeholder="Nhập họ và tên của bạn"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Phone Field */}
                                    <div>
                                        <label
                                            htmlFor="phone"
                                            className="text-sm font-medium text-gray-700 block mb-1.5"
                                        >
                                            Số điện thoại <span className="text-red-500">*</span>
                                        </label>
                                        <div className="group relative transition-all duration-300">
                                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-violet-500 transition-colors">
                                                <Phone className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                id="phone"
                                                value={customerInfo.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all duration-300"
                                                placeholder="Nhập số điện thoại của bạn"
                                                required
                                            />
                                            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                                <span className="text-xs text-gray-400">VD: 0912345678</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address Field */}
                                    <div>
                                        <label
                                            htmlFor="address"
                                            className="text-sm font-medium text-gray-700 block mb-1.5"
                                        >
                                            Địa chỉ nhận hàng <span className="text-red-500">*</span>
                                        </label>
                                        <div className="group relative transition-all duration-300">
                                            <div className="absolute left-3.5 top-4 text-gray-400 pointer-events-none group-focus-within:text-violet-500 transition-colors">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <textarea
                                                name="address"
                                                id="address"
                                                value={customerInfo.address}
                                                onChange={handleInputChange}
                                                rows="3"
                                                className="w-full px-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all duration-300 resize-none"
                                                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                                                required
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <CreditCard className="w-5 h-5 text-green-600" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900">Chọn hình thức thanh toán</h2>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                {/* Momo Option */}
                                <div
                                    className={`border ${
                                        typePayment === 'momo'
                                            ? 'border-2 border-pink-400 bg-pink-50'
                                            : 'border-gray-200'
                                    } rounded-xl p-4 hover:border-pink-400 hover:bg-pink-50 transition-all duration-200 cursor-pointer`}
                                    onClick={() => setTypePayment('momo')}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className={`w-5 h-5 ${
                                                typePayment === 'momo'
                                                    ? 'bg-pink-500 flex items-center justify-center'
                                                    : 'border-2 border-gray-300'
                                            } rounded-full transition-all duration-200`}
                                        >
                                            {typePayment === 'momo' && <CheckCircle className="w-3 h-3 text-white" />}
                                        </div>
                                        <img
                                            src="https://developers.momo.vn/v3/vi/assets/images/square-8c08a00f550e40a2efafea4a005b1232.png"
                                            alt="Momo"
                                            className="w-8 h-8 rounded"
                                        />
                                        <span className="font-medium text-gray-900">Ví Momo</span>
                                    </div>
                                </div>

                                {/* Cash Option */}
                                <div
                                    className={`border ${
                                        typePayment === 'cod'
                                            ? 'border-2 border-blue-400 bg-blue-50'
                                            : 'border-gray-200'
                                    } rounded-xl p-4 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer`}
                                    onClick={() => setTypePayment('cod')}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className={`w-5 h-5 ${
                                                typePayment === 'cod'
                                                    ? 'bg-blue-500 flex items-center justify-center'
                                                    : 'border-2 border-gray-300'
                                            } rounded-full transition-all duration-200`}
                                        >
                                            {typePayment === 'cod' && <CheckCircle className="w-3 h-3 text-white" />}
                                        </div>
                                        <img
                                            src="https://salt.tikicdn.com/ts/upload/92/b2/78/1b3b9cda5208b323eb9ec56b84c7eb87.png"
                                            alt="Cash"
                                            className="w-8 h-8 rounded"
                                        />
                                        <span className="font-medium text-gray-900">Thanh toán tiền mặt</span>
                                    </div>
                                </div>

                                {/* VNPAY Option */}
                                <div
                                    className={`border ${
                                        typePayment === 'vnpay'
                                            ? 'border-2 border-blue-400 bg-blue-50'
                                            : 'border-gray-200'
                                    } rounded-xl p-4 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer`}
                                    onClick={() => setTypePayment('vnpay')}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className={`w-5 h-5 ${
                                                typePayment === 'vnpay'
                                                    ? 'bg-blue-500 flex items-center justify-center'
                                                    : 'border-2 border-gray-300'
                                            } rounded-full transition-all duration-200`}
                                        >
                                            {typePayment === 'vnpay' && <CheckCircle className="w-3 h-3 text-white" />}
                                        </div>
                                        <img
                                            src="https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg"
                                            alt="VNPAY"
                                            className="w-8 h-8 rounded"
                                        />
                                        <div>
                                            <div className="font-medium text-gray-900">VNPAY</div>
                                            <div className="text-xs text-gray-500">
                                                Quét Mã QR từ ứng dụng ngân hàng
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-5">
                            <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900">Đơn hàng</h2>
                                    <Link to="/cart">
                                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline">
                                            Thay đổi
                                        </button>
                                    </Link>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Tổng tiền hàng</span>
                                        <span className="font-medium">
                                            {dataCart
                                                .reduce((total, item) => total + item.product.price * item.quantity, 0)
                                                .toLocaleString()}
                                            đ
                                        </span>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-lg font-semibold text-gray-900">
                                                Tổng tiền thanh toán
                                            </span>
                                            <span className="text-2xl font-bold text-red-600">
                                                {dataCart
                                                    .reduce(
                                                        (total, item) => total + item.product.price * item.quantity,
                                                        0,
                                                    )
                                                    .toLocaleString()}
                                                đ
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                                        Giá này đã bao gồm thuế GTGT, phí đóng gói, phí vận chuyển và các chi phí phát
                                        sinh khác
                                    </div>

                                    <button
                                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                        onClick={handleCreatePayment}
                                    >
                                        Thanh toán
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Checkout;
