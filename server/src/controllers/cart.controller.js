const modelCart = require('../models/cart.model');
const modelProduct = require('../models/products.model');

const { BadRequestError } = require('../core/error.response');
const { Created, OK } = require('../core/success.response');

class CartController {
    async createCart(req, res) {
        const { id } = req.user;
        const { product, startDate, endDate, quantity } = req.body;

        // Validate dữ liệu
        if (!product || !quantity || quantity <= 0) {
            throw new BadRequestError('Thiếu hoặc sai thông tin sản phẩm hoặc số lượng');
        }

        const findProduct = await modelProduct.findById(product);
        if (!findProduct) {
            throw new BadRequestError('Sản phẩm không tồn tại');
        }

        let cart = await modelCart.findOne({ userId: id });

        if (cart) {
            const productIndex = cart.product.findIndex((item) => item.productId.toString() === product.toString());

            if (productIndex !== -1) {
                // Sản phẩm đã có trong giỏ, cộng thêm số lượng
                cart.product[productIndex].quantity += quantity;
            } else {
                // Thêm sản phẩm mới vào giỏ
                cart.product.push({
                    productId: product,
                    quantity,
                    startDate,
                    endDate,
                });
            }

            cart.totalPrice += findProduct.price * quantity;
            await cart.save();

            return new OK({
                message: 'Cập nhật giỏ hàng thành công',
                metadata: cart,
            }).send(res);
        } else {
            // Tạo giỏ hàng mới
            const newCart = await modelCart.create({
                userId: id,
                product: [
                    {
                        productId: product,
                        quantity,
                        startDate,
                        endDate,
                    },
                ],
                totalPrice: findProduct.price * quantity,
                // Thêm các trường thông tin người dùng nếu cần
                fullName: req.user.fullName || '',
                phone: req.user.phone || '',
                address: req.user.address || '',
            });

            return new OK({
                message: 'Tạo giỏ hàng thành công',
                metadata: newCart,
            }).send(res);
        }
    }

    async getCart(req, res) {
        const { id } = req.user;
        const cart = await modelCart.findOne({ userId: id });
        const data = await Promise.all(
            cart.product.map(async (item) => {
                const product = await modelProduct.findById(item.productId);
                return {
                    ...item._doc,
                    product: product,
                    totalPrice: product.price * item.quantity,
                };
            }),
        );
        return new OK({
            message: 'Lấy giỏ hàng thành công',
            metadata: data,
        }).send(res);
    }

    async updateQuantity(req, res) {
        const { id } = req.user;
        const { productId, quantity } = req.body;

        // Validate
        if (!productId || !quantity || quantity <= 0) {
            throw new BadRequestError('Thông tin sản phẩm hoặc số lượng không hợp lệ');
        }

        const cart = await modelCart.findOne({ userId: id });
        if (!cart) {
            throw new BadRequestError('Giỏ hàng không tồn tại');
        }

        const productIndex = cart.product.findIndex((item) => item.productId.toString() === productId.toString());

        if (productIndex === -1) {
            throw new BadRequestError('Sản phẩm không có trong giỏ hàng');
        }

        // Cập nhật số lượng
        cart.product[productIndex].quantity = quantity;

        // Cập nhật lại tổng giá
        const productData = await modelProduct.findById(productId);
        if (!productData) {
            throw new BadRequestError('Sản phẩm không tồn tại trong hệ thống');
        }

        // Tính lại toàn bộ totalPrice từ giỏ hàng
        let newTotal = 0;
        for (const item of cart.product) {
            const productInfo = await modelProduct.findById(item.productId);
            if (productInfo) {
                newTotal += productInfo.price * item.quantity;
            }
        }
        cart.totalPrice = newTotal;

        await cart.save();

        return new OK({
            message: 'Cập nhật số lượng thành công',
            metadata: cart,
        }).send(res);
    }

    async deleteItem(req, res) {
        const { id } = req.user;
        const { productId } = req.body;

        const cart = await modelCart.findOne({ userId: id });

        if (!cart) {
            throw new BadRequestError('Giỏ hàng không tồn tại');
        }

        const productIndex = cart.product.findIndex((item) => item.productId.toString() === productId.toString());

        if (productIndex === -1) {
            throw new BadRequestError('Sản phẩm không có trong giỏ hàng');
        }

        cart.product.splice(productIndex, 1);
        await cart.save();

        return new OK({
            message: 'Xóa sản phẩm khỏi giỏ hàng thành công',
            metadata: cart,
        }).send(res);
    }

    async updateInfoCart(req, res) {
        const { fullName, phone, address } = req.body;
        const { id } = req.user;
        if (!fullName || !phone || !address) {
            throw new BadRequestError('Vui lòng nhập thông tin thuê');
        }
        const cart = await modelCart.findOne({ userId: id });
        if (!cart) {
            throw new BadRequestError('Giỏ hàng không tồn tại');
        }
        cart.fullName = fullName;
        cart.phone = phone;
        cart.address = address;
        await cart.save();
        return new OK({
            message: 'Cập nhật thông tin giỏ hàng thành công',
            metadata: cart,
        }).send(res);
    }
}

module.exports = new CartController();
