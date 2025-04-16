import User from "../Models/User.js";
import Order from "../Models/Order.js";
import Product from "../Models/Product.js";
import Warehouse from "../Models/Warehouse.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  const admin = await User.findOne({ email });
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign(
    { id: admin._id, role: "admin" },
    process.env.JWT_SECRET
  );
  res.json({ token });
};

export const getUserList = async (req, res) => {
  const { firstname, lastname, email } = req.query;
  let query = {};
  if (firstname) query.firstname = firstname;
  if (lastname) query.lastname = lastname;
  if (email) query.email = email;
  const users = await User.find({
    ...query,
    _id: { $ne: req.user._id },
  });
  res.json(users);
};

export const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ error: "No user found" });
  const { action } = req.body;
  if (action === "blocked") user.status = "blocked";
  if (action === "active") user.status = "active";
  if (action === "approve") user.status = "approved";
  if (action === "reject") user.status = "rejected";
  if (action === "delete") return res.json(await User.findByIdAndDelete(id));
  const updated = await User.findByIdAndUpdate(id, user, { new: true });
  res.json(updated);
};

export const addWarehouse = async (req, res) => {
  const { warehouseName } = req.body;
  const warehouse = await Warehouse.create({ warehouseName });
  res.status(201).json(warehouse);
};
export const addProduct = async (req, res) => {
  const { name, description, price, stock, warehouseId, longitude, latitude } =
    req.body;
  try {
    if (!longitude || !latitude) {
      return res
        .status(400)
        .json({
          message: "Location coordinates (longitude and latitude) are required",
        });
    }
    const product = await Product.create({
      name,
      description,
      price,
      stock,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });
    const updatedWarehouse = await Warehouse.findByIdAndUpdate(
      warehouseId,
      {
        $push: {
          stock: {
            product: product._id,
            quantity: stock,
          },
        },
      },
      { new: true }
    );

    if (!updatedWarehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    res.status(201).json({
      message:
        "Product created with location data and added to warehouse stock",
      product,
      warehouse: updatedWarehouse,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message:
          "An error occurred while adding product and updating warehouse",
        error,
      });
  }
};
export const manageOrder = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;
  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (action === "accept") order.status = "accepted";
  if (action === "reject") order.status = "rejected";
  await order.save();
  res.json(order);
};

export const getLowStockNotifications = async (req, res) => {
  const products = await Product.find({ stock: { $lt: 5 } });
  res.json(products);
};
