const mongoose = require('mongoose');

const { Schema } = mongoose;

const productsSchema = new Schema(
    {
        nameProduct: { type: String, require: true }, // tên
        price: { type: Number, require: true }, // giá
        description: { type: String, require: true }, // mô tả
        images: { type: Array, require: true }, // ảnh
        category: { type: String, require: true }, // thể loại
        stock: { type: Number, require: true }, // số lượng sản phẩm
        discountProduct: { type: Number, default: 0 }, // giam gia

        publisher: { type: String, require: true }, // công ty phát hành
        publishingHouse: { type: String, require: true }, // nhà xuất bản
        coverType: { type: String, require: true, enum: ['paperback', 'hardcover'] }, // Loại bìa
        //metadata: { type: mongoose.Schema.Types.Mixed }, // thong tin them
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('products', productsSchema);
