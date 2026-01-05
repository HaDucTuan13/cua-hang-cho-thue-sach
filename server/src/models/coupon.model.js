const mongoose = require('mongoose');

const { Schema } = mongoose;

const couponSchema = new Schema(
    {
        nameCoupon: { type: String, required: true },
        discount: { type: Number, required: true },
        quantity: { type: Number, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        minPrice: { type: Number, required: true },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Coupon', couponSchema);
