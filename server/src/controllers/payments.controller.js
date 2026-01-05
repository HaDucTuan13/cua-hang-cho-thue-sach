const modelCart = require('../models/cart.model');
const modelPayments = require('../models/payments.model');
const modelProduct = require('../models/products.model');

const { BadRequestError } = require('../core/error.response');
const { Created, OK } = require('../core/success.response');

const crypto = require('crypto');
const axios = require('axios');
const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } = require('vnpay');

require('dotenv').config();

class PaymentsController {
    async createPayment(req, res) {
        const { id } = req.user;
        const { typePayment } = req.body;
        const cart = await modelCart.findOne({ userId: id });
        if (!cart) {
            throw new BadRequestError('Giỏ hàng không tồn tại');
        }
        if (!cart.fullName || !cart.phone || !cart.address) {
            throw new BadRequestError('Vui lòng cập nhật thông tin thuê');
        }
        if (typePayment === 'cod') {
            const payments = await modelPayments.create({
                userId: id,
                fullName: cart.fullName,
                phone: cart.phone,
                address: cart.address,
                product: cart.product,
                totalPrice: cart.totalPrice,
                status: 'pending',
                paymentMethod: 'cod',
            });

            // Trừ stock cho từng sản phẩm trong giỏ
            for (const item of cart.product) {
                const product = await modelProduct.findById(item.productId);
                if (!product) {
                    throw new BadRequestError('Sản phẩm không tồn tại');
                }
                if (product.stock < item.quantity) {
                    throw new BadRequestError('Số lượng sản phẩm không đủ');
                }

                // Nếu đủ hàng thì trừ stock
                await modelProduct.findByIdAndUpdate(item.productId, {
                    $inc: { stock: -item.quantity },
                });
            }

            await modelCart.deleteOne({ userId: id });
            return new Created({
                message: 'Tạo đơn hàng thành công',
                metadata: payments,
            }).send(res);
        } else if (typePayment === 'momo') {
            var partnerCode = 'MOMO';
            var accessKey = 'F8BBA842ECF85';
            var secretkey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
            var requestId = partnerCode + new Date().getTime();
            var orderId = requestId;
            var orderInfo = `thanh toan ${cart._id}`;
            var redirectUrl = 'http://localhost:3000/api/payments/check-payment-momo';
            var ipnUrl = 'http://localhost:3000/api/payments/check-payment-momo';
            var amount = cart.totalPrice;
            var requestType = 'captureWallet';
            var extraData = '';

            var rawSignature =
                'accessKey=' +
                accessKey +
                '&amount=' +
                amount +
                '&extraData=' +
                extraData +
                '&ipnUrl=' +
                ipnUrl +
                '&orderId=' +
                orderId +
                '&orderInfo=' +
                orderInfo +
                '&partnerCode=' +
                partnerCode +
                '&redirectUrl=' +
                redirectUrl +
                '&requestId=' +
                requestId +
                '&requestType=' +
                requestType;

            var signature = crypto.createHmac('sha256', secretkey).update(rawSignature).digest('hex');

            const requestBody = JSON.stringify({
                partnerCode,
                accessKey,
                requestId,
                amount,
                orderId,
                orderInfo,
                redirectUrl,
                ipnUrl,
                extraData,
                requestType,
                signature,
                lang: 'en',
            });

            const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody, {
                headers: { 'Content-Type': 'application/json' },
            });

            //  Tạo đơn hàng trong DB
            const payments = await modelPayments.create({
                userId: id,
                fullName: cart.fullName,
                phone: cart.phone,
                address: cart.address,
                product: cart.product,
                totalPrice: cart.totalPrice,
                status: 'pending',
                paymentMethod: 'momo',
            });

            //  Trừ stock cho từng sản phẩm
            for (const item of cart.product) {
                const product = await modelProduct.findById(item.productId);
                if (!product) {
                    throw new BadRequestError('Sản phẩm không tồn tại');
                }
                if (product.stock < item.quantity) {
                    throw new BadRequestError('Số lượng sản phẩm không đủ');
                }
                await modelProduct.findByIdAndUpdate(item.productId, {
                    $inc: { stock: -item.quantity },
                });
            }

            //  Xóa giỏ hàng
            await modelCart.deleteOne({ userId: id });

            return new Created({
                message: 'Thanh toán thành công',
                metadata: response.data.payUrl,
            }).send(res);
        } else if (typePayment === 'vnpay') {
            const vnpay = await new VNPay({
                tmnCode: 'GS1I559X',
                secureSecret: 'WWS2Y89FTXLSQKVH54CERAMWNAJMNUB5',
                vnpayHost: 'https://sandbox.vnpayment.vn/merchantv2',
                testMode: true,
                hashAlgorithm: 'SHA512',
                enableLog: true,
                loggerFn: ignoreLogger,
            });

            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            const resVnpay = vnpay.buildPaymentUrl({
                vnp_Amount: cart.totalPrice,
                vnp_IpAddr: '127.0.0.1',
                vnp_TxnRef: cart._id,
                vnp_OrderInfo: cart._id,
                vnp_OrderType: ProductCode.Other,
                vnp_ReturnUrl: `http://localhost:3000/api/payments/check-payment-vnpay`,
                vnp_Locale: VnpLocale.VN,
                vnp_CreateDate: dateFormat(new Date()),
                vnp_ExpireDate: dateFormat(tomorrow),
            });

            // 🔽 Tạo đơn hàng trong DB
            const payments = await modelPayments.create({
                userId: id,
                fullName: cart.fullName,
                phone: cart.phone,
                address: cart.address,
                product: cart.product,
                totalPrice: cart.totalPrice,
                status: 'pending',
                paymentMethod: 'vnpay',
            });

            // 🔽 Trừ stock cho từng sản phẩm
            for (const item of cart.product) {
                const product = await modelProduct.findById(item.productId);
                if (!product) {
                    throw new BadRequestError('Sản phẩm không tồn tại');
                }
                if (product.stock < item.quantity) {
                    throw new BadRequestError('Số lượng sản phẩm không đủ');
                }
                await modelProduct.findByIdAndUpdate(item.productId, {
                    $inc: { stock: -item.quantity },
                });
            }

            // 🔽 Xóa giỏ hàng
            await modelCart.deleteOne({ userId: id });

            return new Created({
                message: 'Tạo đơn hàng thành công',
                statusCode: 201,
                metadata: resVnpay,
            }).send(res);
        }
    }

    async checkPaymentMomo(req, res, next) {
        const { orderInfo, resultCode } = req.query;
        if (resultCode === '0') {
            const result = orderInfo.split(' ')[2];
            const findCart = await modelCart.findOne({ _id: result });
            const newPayment = new modelPayments({
                fullName: findCart.fullName,
                phone: findCart.phone,
                address: findCart.address,
                product: findCart.product,
                totalPrice: findCart?.totalPrice,
                paymentMethod: 'MOMO',
                userId: findCart.userId,
                status: 'pending',
            });

            await newPayment.save();
            await findCart.deleteOne();
            return res.redirect(`${process.env.DOMAIN_URL}/payments/${newPayment._id}`);
        }
    }

    async checkPaymentVnpay(req, res) {
        const { vnp_OrderInfo, vnp_ResponseCode } = req.query;
        try {
            if (vnp_ResponseCode === '00') {
                const findCart = await modelCart.findOne({ _id: vnp_OrderInfo });
                const newPayment = new modelPayments({
                    fullName: findCart.fullName,
                    phone: findCart.phone,
                    address: findCart.address,
                    product: findCart.product,
                    totalPrice: findCart?.totalPrice,
                    paymentMethod: 'VNPAY',
                    userId: findCart.userId,
                    status: 'pending',
                });
                await newPayment.save();
                await findCart.deleteOne();
                return res.redirect(`${process.env.DOMAIN_URL}/payments/${newPayment._id}`);
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Lỗi server' });
        }
    }

    async getPaymentById(req, res) {
        const { id } = req.query;

        const payment = await modelPayments.findById(id);
        if (!payment) {
            throw new BadRequestError('Đơn hàng không tồn tại');
        }

        const detailedProducts = await Promise.all(
            payment.product.map(async (item) => {
                const product = await modelProduct.findById(item.productId).lean();
                return {
                    product,
                    quantity: item.quantity,
                    startDate: item.startDate,
                    endDate: item.endDate,
                };
            }),
        );

        return new OK({
            message: 'Lấy đơn hàng thành công',
            metadata: {
                _id: payment._id,
                userId: payment.userId,
                fullName: payment.fullName,
                phone: payment.phone,
                address: payment.address,
                products: detailedProducts,
                totalPrice: payment.totalPrice,
                status: payment.status,
                paymentMethod: payment.paymentMethod,
                createdAt: payment.createdAt,
                updatedAt: payment.updatedAt,
            },
        }).send(res);
    }

    async getPaymentByUserId(req, res) {
        const { id } = req.user;

        const payments = await modelPayments.find({ userId: id }).sort({ createdAt: -1 }); // sắp xếp mới nhất

        const data = await Promise.all(
            payments.map(async (payment) => {
                const detailedProducts = await Promise.all(
                    payment.product.map(async (item) => {
                        const product = await modelProduct.findById(item.productId).lean();
                        return {
                            product,
                            quantity: item.quantity,
                            startDate: item.startDate,
                            endDate: item.endDate,
                        };
                    }),
                );

                return {
                    _id: payment._id,
                    fullName: payment.fullName,
                    phone: payment.phone,
                    address: payment.address,
                    products: detailedProducts,
                    totalPrice: payment.totalPrice,
                    status: payment.status,
                    paymentMethod: payment.paymentMethod,
                    createdAt: payment.createdAt,
                    updatedAt: payment.updatedAt,
                };
            }),
        );

        return new OK({
            message: 'Lấy đơn hàng thành công',
            metadata: data,
        }).send(res);
    }

    async cancelOrder(req, res) {
        const { id } = req.body;
        const payment = await modelPayments.findById(id);
        if (!payment) {
            throw new BadRequestError('Đơn hàng không tồn tại');
        }
        payment.status = 'cancelled';
        await payment.save();
        return new OK({
            message: 'Huỷ đơn hàng thành công',
        }).send(res);
    }

    async getPaymentsAdmin(req, res) {
        const payments = await modelPayments.find().sort({ createdAt: -1 });
        const data = await Promise.all(
            payments.map(async (payment) => {
                const detailedProducts = await Promise.all(
                    payment.product.map(async (item) => {
                        const product = await modelProduct.findById(item.productId).lean();
                        return {
                            product,
                            quantity: item.quantity,
                            startDate: item.startDate,
                            endDate: item.endDate,
                        };
                    }),
                );

                return {
                    _id: payment._id,
                    fullName: payment.fullName,
                    phone: payment.phone,
                    address: payment.address,
                    products: detailedProducts,
                    totalPrice: payment.totalPrice,
                    status: payment.status,
                    paymentMethod: payment.paymentMethod,
                    createdAt: payment.createdAt,
                    updatedAt: payment.updatedAt,
                };
            }),
        );
        return new OK({
            message: 'Lấy đơn hàng thành công',
            metadata: data,
        }).send(res);
    }

    async updateOrderStatus(req, res) {
        const { id, status } = req.body;
        const payment = await modelPayments.findById(id);
        if (!payment) {
            throw new BadRequestError('Đơn hàng không tồn tại');
        }
        payment.status = status;
        await payment.save();
        return new OK({
            message: 'Cập nhật trạng thái đơn hàng thành công',
        }).send(res);
    }
}

module.exports = new PaymentsController();
