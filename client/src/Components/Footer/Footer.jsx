// import { FacebookFilled, YoutubeFilled } from 'antd/es/icons';

function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-8 w-[95%] mx-auto">
            <div className="mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-gray-700">
                {/* Hỗ trợ khách hàng */}
                <div>
                    <h3 className="font-semibold mb-2">Hỗ trợ khách hàng</h3>
                    <div className="mb-1">
                        Hotline: <span className="font-semibold">08xx-xxxx-xx</span>
                    </div>
                    <div className="mb-1 text-xs text-gray-500">(1000 đ/phút, 8-21h kể cả T7, CN)</div>
                    <ul className="space-y-1 mt-2">
                        <li>Các câu hỏi thường gặp</li>
                        <li>Gửi yêu cầu hỗ trợ</li>
                        <li>Hướng dẫn đặt hàng</li>
                        <li>Phương thức vận chuyển</li>
                        <li>Chính sách kiểm hàng</li>
                        <li>Chính sách đổi trả</li>
                        <li>Hướng dẫn trả góp</li>
                        <li>Chính sách nhập khẩu</li>
                        <li>Hỗ trợ khách hàng: hotro@hdt.vn</li>
                        <li>Báo lỗi bảo mật: security@hdt.vn</li>
                    </ul>
                </div>
                {/* Về Tiki */}
                <div>
                    <h3 className="font-semibold mb-2">Về HĐT</h3>
                    <ul className="space-y-1">
                        <li>Giới thiệu HĐT</li>
                        <li>HĐT Blog</li>
                        <li>Chính sách bảo mật thanh toán</li>
                        <li>Chính sách bảo mật thông tin cá nhân</li>
                        <li>Chính sách giải quyết khiếu nại</li>
                        <li>Điều khoản sử dụng</li>
                        <li>Tiếp thị liên kết cùng HĐT</li>
                        <li>Bán hàng doanh nghiệp</li>
                        <li>Điều kiện vận chuyển</li>
                    </ul>
                </div>
                {/* Hợp tác & liên kết */}
                <div>
                    <h3 className="font-semibold mb-2">Hợp tác và liên kết</h3>
                    <ul className="space-y-1">
                        <li>Quy chế hoạt động Sàn GDTMĐT</li>
                        <li>Bán hàng cùng HĐT</li>
                    </ul>
                    <h3 className="font-semibold mt-4 mb-2">Chứng nhận bởi</h3>
                    <div className="flex space-x-2 items-center">
                        <img
                            src="https://frontend.tikicdn.com/_desktop-next/static/img/footer/bo-cong-thuong-2.png"
                            alt="Bộ Công Thương"
                            className="h-8"
                        />
                        <img
                            src="https://frontend.tikicdn.com/_desktop-next/static/img/footer/bo-cong-thuong.svg"
                            alt="Đã đăng ký"
                            className="h-8"
                        />
                        <img
                            src="https://images.dmca.com/Badges/dmca_protected_sml_120y.png?ID=388d758c-6722-4245-a2b0-1d2415e70127"
                            alt="DMCA"
                            className="h-8"
                        />
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Kết nối với chúng tôi</h3>
                    <div className="flex space-x-3 mb-4">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/2048px-Icon_of_Zalo.svg.png"
                            alt=""
                            className="h-10"
                        />
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiXN9xSEe8unzPBEQOeAKXd9Q55efGHGB9BA&s"
                            alt=""
                            className="h-10"
                        />
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
