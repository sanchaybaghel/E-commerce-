const User = require('../models/User');

exports.syncUser = async (req, res) => {
  try {
    const { uid, email } = req.user; 
    const name = req.body.name;
    const incomingRole = req.body.role; 
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
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
      
      if (req.body.name && req.body.name !== user.name) user.name = req.body.name;
      if (email && email !== user.email) user.email = email;
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
    console.log("err",err);
    res.status(500).json({ message: err.message });
  }
};
exports.setCookie = async (req, res) => {
  console.log("enter into setCookie")
  try {
    const { token } = req.body;
    console.log("token",token)
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 15 * 60 * 60 * 1000
    });
    console.log("cookie",res.cookie)
    res.json({ message: 'Cookie set successfully' });
  } catch (error) {
    console.log("error", error.message);
    res.status(500).json({ message: error.message });
  }
};
exports.logout=async(req,res)=>{
  try{
    res.clearCookie('token');
    res.json({message:'Logout successful'})
  }catch(error){
    console.log("error",error)
    res.status(500).json({message:error.message})
  }
}
