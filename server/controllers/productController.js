const Product = require('../models/Product');
const User = require('../models/User');


exports.addProduct = async (req, res) => {
  try {
    // Only allow shopkeeper or admin
    const user = await User.findOne({ firebaseUid: req.user.uid }).select('_id role');
    if (!user || (user.role !== 'shopkeeper' && user.role !== 'admin')) {
      return res.status(403).json({ message: 'Forbidden: Only shopkeepers or admins can upload products.' });
    }

    const { name, price, description,category } = req.body;
    const images = req.files.map(file => file.path);

    const product = new Product({
      name,
      price,
      description,
      images,
      category,
      shopkeeper: user._id 
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.log("err.message",err.message)
    console.log("eroe")
    res.status(500).json({ message: err.message });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('shopkeeper', 'name email');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('shopkeeper', 'name email');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a review to a product
exports.addReview = async (req, res) => {
  try {
    const user=await User.findOne({firebaseUid:req.user.uid})
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Prevent multiple reviews by same user
    const alreadyReviewed = product.reviews.find(r => r.user.toString() === user._id);
    if (alreadyReviewed) return res.status(400).json({ message: 'Product already reviewed' });

    const review = {
      user: user._id,
      name: req.user.name || 'User',
      rating: Number(rating),
      comment
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.numReviews;
    await product.save();
    res.status(201).json({ message: 'Review added', reviews: product.reviews });
  } catch (err) {
    console.log("eror",err)
    res.status(500).json({ message: err.message });
  }
};

// Search products

exports.searchProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
    let filter = {};

    if (keyword) {
      filter.name = { $regex: keyword, $options: 'i' };
    }
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const skip = (Number(page) - 1) * Number(limit);
    const products = await Product.find(filter)
      .skip(skip)
      .limit(Number(limit));
     
    const total = await Product.countDocuments(filter);
    res.json({
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};