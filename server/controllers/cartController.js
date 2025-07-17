const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { messaging } = require('firebase-admin');

exports.addToCart = async (req, res) => {
  console.log("enter into addToCart")
  try {
    const userId = req.user.uid || req.user.id;
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.stock < (quantity || 1)) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if product already in cart
    const cartItem = user.cart.find(item => item.product.toString() === productId);
    if (cartItem) {
      cartItem.quantity += quantity || 1;
    } else {
      user.cart.push({ product: productId, quantity: quantity || 1 });
    }

    await user.save();
    res.json({ cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.uid || req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const cartItem = user.cart.find(item => item.product.toString() === productId);
    if (!cartItem) return res.status(404).json({ message: 'Product not in cart' });

    cartItem.quantity = quantity;
    await user.save();
    res.json({ cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Note: Direct checkout is deprecated. Use payment-based checkout instead.
// This endpoint is kept for backward compatibility but should redirect to payment
exports.checkout = async (req, res) => {
  res.status(400).json({
    message: 'Direct checkout is no longer supported. Please use the payment system.',
    redirectTo: '/api/payment/create-cart-checkout-session'
  });
};

exports.viewCart = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid }).populate('cart.product');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ cart: user.cart });
  } catch (err) {
    console.log("cart", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
 // console.log("enter into removeFromCart")
  try {
    const userId = req.user.uid || req.user.id;
    const { productId } = req.params;
   // console.log("productId",productId)
    //console.log("userId",userId)
  const user = await User.findOne({ firebaseUid: req.user.uid }).populate('cart.product');
    if (!user) return res.status(404).json({ message: 'User not found' });
    //console.log("user",user)
    user.cart = user.cart.filter(item => item.product._id.toString() !== productId);
    //console.log("user.cart",user.cart)
    await user.save();
    res.json({ cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAdminOrders=async (req,res)=>{
  try{
    console.log("req",req.user)
     const userId=await User.findOne({firebaseUid:req.user.uid}).select('_id')
     const productIds=await Product.find({shopkeeper:userId}).select('_id')
     const orders=await Order.find({"items.product":{$in:productIds}})
     .populate('items.product')
     .populate('user')
     .sort({createdAt:-1});
     res.json(orders)
  }
  catch(err){
    console.log("err",err.message)
    res.status(500).json({message:err.message});
  }
}

