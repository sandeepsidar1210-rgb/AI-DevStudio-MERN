const User = require('../models/User.model.js');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateTokens.js');

// @route POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      tier: user.tier,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// @route POST /api/auth/login

const loginUser = async (req, res) => {
    try {
        const {email , password } = req.body;
        const user = await User.findOne({email});
        if(!user ) {
            return res.status(401).json ({message: " Invalid Credentials "});    
        }

        const isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch){
            return res.status(401).json({message: " Invalid Credentials "});
        }

        const token = generateToken(user._id);

        res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        tier: user.tier,
        token,
        });
        
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    };

  // @route GET /api/auth/me

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

    module.exports = { registerUser, loginUser ,getMe};