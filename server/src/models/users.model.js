const mongoose = require('mongoose');

const { Schema } = mongoose;

const usersSchema = new Schema(
    {
        fullName: { type: String, require: true },
        email: { type: String, require: true, unique: true },
        password: { type: String, require: true },
        phone: { type: String, require: true },
        role: { type: String, require: true, enum: ['admin', 'user'], default: 'user' },
        avatar: { type: String, require: true, default: 'https://cdn-icons-png.flaticon.com/512/6596/6596121.png' },
        address: { type: String, require: true },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('users', usersSchema);
