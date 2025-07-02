const User = require('../models/User');

exports.syncUser = async (req, res) => {
  try {
    const { uid, email } = req.user; 
    const name = req.body.name;
    const incomingRole = req.body.role; // role sent from frontend (optional)
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      // Only set role on creation, default to customer if not provided
      user = new User({
        firebaseUid: uid,
        name: name || '',
        email,
        role: incomingRole || 'customer',
        cart: [],
        addresses: [],
        wishlist: []
      });
      await user.save();
    } else {
      // Only update name/email, NOT role unless explicitly sent and different
      if (req.body.name && req.body.name !== user.name) user.name = req.body.name;
      if (email && email !== user.email) user.email = email;
      // Only update role if a new role is sent and it's different
      if (incomingRole && incomingRole !== user.role) user.role = incomingRole;
      await user.save();
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        cart: user.cart,
        addresses: user.addresses,
        wishlist: user.wishlist
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};