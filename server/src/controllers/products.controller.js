const modelProduct = require('../models/products.model');
const mongoose = require('mongoose');
const cloudinary = require('../utils/configCloudDinary');

const { BadRequestError } = require('../core/error.response');
const { Created, OK } = require('../core/success.response');

function getPublicId(url) {
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');

    if (uploadIndex === -1) {
        throw new Error('Invalid Cloudinary URL');
    }

    const pathParts = parts.slice(uploadIndex + 1);
    const pathWithoutVersion = pathParts[0].startsWith('v') ? pathParts.slice(1) : pathParts;
    const publicIdWithExt = pathWithoutVersion.join('/');
    const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));

    return publicId;
}

const fs = require('fs/promises');

class ProductsController {
    async createProduct(req, res) {
        const { nameProduct, images, price, description, category, stock, publisher, publishingHouse, coverType } =
            req.body;
        if (
            !nameProduct ||
            !price ||
            !description ||
            !category ||
            !stock ||
            !publisher ||
            !publishingHouse ||
            !coverType ||
            !images
        ) {
            throw new BadRequestError('Vui lòng nhập đầy đủ thông tin');
        }
        const product = await modelProduct.create({
            nameProduct,
            price,
            description,
            category,
            stock,
            images,
            publisher,
            publishingHouse,
            coverType,
        });
        return new Created({
            message: 'Tạo sản phẩm thành công',
            metadata: product,
        }).send(res);
    }

    async uploadImages(req, res) {
        try {
            const files = req.files;

            const dataFile = await Promise.all(
                files.map(async (item) => {
                    const result = await cloudinary.uploader.upload(item.path, {
                        folder: 'products',
                        resource_type: 'image',
                    });
                    await fs.unlink(item.path);
                    return result.secure_url;
                }),
            );

            return new OK({
                message: 'Upload ảnh thành công',
                metadata: dataFile,
            }).send(res);
        } catch (error) {
            console.error(error);
            return new BadRequestError('Lỗi khi upload ảnh').send(res);
        }
    }

    async deleteImage(req, res) {
        const { id, image } = req.body;
        const product = await modelProduct.findById(id);
        const publicId = getPublicId(image);
        await cloudinary.uploader.destroy(publicId);
        product.images = product.images.filter((img) => img !== image);
        await product.save();
        return new OK({
            message: 'Xóa ảnh thành công',
            metadata: product,
        }).send(res);
    }

    async getProducts(req, res) {
        const products = await modelProduct.find();
        return new OK({
            message: 'Lấy sản phẩm thành công',
            metadata: products,
        }).send(res);
    }

    async updateProduct(req, res) {
        const { id, nameProduct, images, price, description, category, stock, publisher, publishingHouse, coverType } =
            req.body;
        const product = await modelProduct.findByIdAndUpdate(id, {
            nameProduct,
            price,
            description,
            category,
            stock,
            publisher,
            publishingHouse,
            images,
            coverType,
        });
        return new OK({
            message: 'Cập nhật sản phẩm thành công',
            metadata: product,
        }).send(res);
    }

    async deleteProduct(req, res) {
        const { id } = req.body;
        const product = await modelProduct.findByIdAndDelete(id);
        product.images.forEach(async (image) => {
            const publicId = getPublicId(image);
            await cloudinary.uploader.destroy(publicId);
        });
        return new OK({
            message: 'Xóa sản phẩm thành công',
            metadata: product,
        }).send(res);
    }

    async getProductById(req, res) {
        const { id } = req.query;
        const product = await modelProduct.findById(id);
        return new OK({
            message: 'Lấy sản phẩm thành công',
            metadata: product,
        }).send(res);
    }

    async SearchProduct(req, res) {
        const { nameProduct } = req.query;
        if (!nameProduct || nameProduct.trim() === '' || nameProduct === 'undefined') {
            return new OK({ message: 'Không tìm thấy sản phẩm', metadata: [] }).send(res);
        }

        const dataProducts = await modelProduct.find({ nameProduct: { $regex: nameProduct, $options: 'i' } });
        if (!dataProducts) {
            return new OK({ message: 'Không tìm thấy sản phẩm', metadata: [] }).send(res);
        }
        const validProducts = dataProducts.filter((product) => mongoose.Types.ObjectId.isValid(product._id));

        if (validProducts.length === 0) {
            return new OK({ message: 'Không tìm thấy sản phẩm', metadata: [] }).send(res);
        }

        return new OK({ message: 'Tìm kiếm sản phẩm thành công', metadata: validProducts }).send(res);
    }
}

module.exports = new ProductsController();
