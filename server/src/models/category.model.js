const mongoose = require('mongoose');

const { Schema } = mongoose;

const categorySchema = new Schema(
    {
        nameCategory: { type: String, require: true },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('category', categorySchema);
