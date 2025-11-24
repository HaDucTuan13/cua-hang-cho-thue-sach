const express = require('express');
const router = express.Router();

const { asyncHandler, authUser } = require('../auth/checkAuth');

const cartController = require('../controllers/cart.controller');

router.post('/create', authUser, asyncHandler(cartController.createCart));
router.get('/get', authUser, asyncHandler(cartController.getCart));
router.put('/update-quantity', authUser, asyncHandler(cartController.updateQuantity));
router.post('/delete-item', authUser, asyncHandler(cartController.deleteItem));
router.post('/update-info', authUser, asyncHandler(cartController.updateInfoCart));

module.exports = router;
