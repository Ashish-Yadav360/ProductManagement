import generateToken from "../Jwt/GenerateToken.js";
import Product from "../Models/Product.js";
import User from "../Models/User.js";
import Order from "../Models/Order.js";
import bcrypt from "bcrypt";
export const userSignup = async (req, res) => {
  try {
    const { firstname, lastname, email, phone, password, role } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(402).json({ error: "User already exist" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      firstname,
      lastname,
      email,
      phone,
      password: hashedPassword,
      role,
    });
    if (newUser) {
      const token = generateToken(newUser._id, role);
      return res.status(201).json({ token });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    const user = await User.findOne(email ? { email } : { phone });
    console.log(user);
    if (!user || user.status === "blocked" || user.status !== "approved")
      return res.status(401).json({ error: "Access denied" });
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword)
      return res.status(404).json({ error: "Invalid credentials" });
    const token = generateToken(user._id, user.role);
    console.log(user);
    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server Error" });
  }
};

export const productUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { latitude, longitude } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const coordinates = [longitude, latitude];

    const products = await Product.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: coordinates,
          },
          distanceField: "distance",
          spherical: true,
          maxDistance: 10000,
          key: "location",
        },
      },
    ]);

    res.status(200).json({
      message: "Products retrieved within 10 km radius",
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while retrieving products",
      error: error.message || error,
    });
  }
};

export const addOrder = async (req, res) => {
  const { productId } = req.body;
  const product = await Product.findById(productId);
  if (!product || product.stock < 1)
    return res.status(400).json({ message: "Product out of stock" });
  console.log(req.user);
  const order = await Order.create({ userId: req.user.user_id, productId });
  product.stock -= 1;
  await product.save();
  res.status(201).json({ message: "Order created successfully", order });
};
