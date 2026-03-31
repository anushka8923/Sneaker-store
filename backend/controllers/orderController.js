import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Address from "../models/Address.js";


// ✅ CREATE ORDER (PLACE ORDER)
export const createOrder = async (req, res) => {
  try {
    const { userId, addressId, paymentMethod } = req.body;

    // 🔴 Validation
    if (!userId || !addressId) {
      return res.status(400).json({
        message: "userId and addressId are required ❌",
      });
    }

    // 🛒 Get cart with products
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty ❌",
      });
    }

    // 📍 Get address
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({
        message: "Address not found ❌",
      });
    }

    // 📦 Prepare order items
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    // 💰 Calculate total amount
    const totalAmount = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // 🧾 Create order
    const order = await Order.create({
      user: userId,
      address: addressId,
      items: orderItems,
      totalAmount,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: "Pending",
      orderStatus: "Placed",
    });

    // 🧹 Clear cart after order
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully ✅",
      order,
    });

  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({
      message: "Server error ❌",
    });
  }
};



// ✅ GET ALL ORDERS OF USER
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user: userId })
      .populate("items.product")
      .populate("address")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    console.error("Get Orders Error:", error);
    res.status(500).json({
      message: "Server error ❌",
    });
  }
};



// ✅ GET SINGLE ORDER
export const getSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("items.product")
      .populate("address");

    if (!order) {
      return res.status(404).json({
        message: "Order not found ❌",
      });
    }

    res.json(order);

  } catch (error) {
    console.error("Single Order Error:", error);
    res.status(500).json({
      message: "Server error ❌",
    });
  }
};