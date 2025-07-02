const express = require('express');
const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const { addProduct, getProducts, addReview, searchProducts, getProduct } = require('../controllers/productController');
const firebaseAuth = require('../middleware/auth');

const router = express.Router();
const upload = multer({ storage });

router.post('/', firebaseAuth, upload.array('images', 5), addProduct);

router.get('/search', searchProducts);
router.get('/', getProducts);

router.get('/:id', getProduct);

router.post('/:productId/review', firebaseAuth, addReview);


module.exports = router;