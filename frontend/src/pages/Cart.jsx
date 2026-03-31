import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState(null);

  const navigate = useNavigate(); // ✅ added

  // 👉 Temporary userId
  const userId = localStorage.getItem("userId");

  // 🛒 Load cart
  const loadCart = async () => {
    try {
      const res = await api.get(`/cart/${userId}`);
      setCart(res.data);
    } catch (err) {
      console.error("Error loading cart:", err);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // ❌ Remove item
  const handleRemove = async (productId) => {
    try {
      await api.delete(`/cart/remove/${userId}/${productId}`);
      loadCart();
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  // 🔄 Update quantity
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      await api.put("/cart/update", {
        userId,
        productId,
        quantity,
      });
      loadCart();
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  // 💰 Total price
  const totalPrice =
    cart?.items?.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    ) || 0;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center mt-10 text-xl">
        🛒 Cart is empty
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

      <div className="space-y-4">
        {cart.items.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center border p-4 rounded"
          >
            {/* 📦 Product Info */}
            <div>
              <h3 className="font-semibold">{item.product.title}</h3>
              <p>₹{item.product.price}</p>
            </div>

            {/* 🔢 Quantity Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  updateQuantity(item.product._id, item.quantity - 1)
                }
                className="px-2 bg-gray-200 rounded"
              >
                -
              </button>

              <span>{item.quantity}</span>

              <button
                onClick={() =>
                  updateQuantity(item.product._id, item.quantity + 1)
                }
                className="px-2 bg-gray-200 rounded"
              >
                +
              </button>
            </div>

            {/* ❌ Remove */}
            <button
              onClick={() => handleRemove(item.product._id)}
              className="text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* 💰 Total + Checkout */}
      <div className="mt-6 text-right">
        <h3 className="text-xl font-bold">
          Total: ₹{totalPrice}
        </h3>

        {/* 🚀 Checkout Button */}
        <button
          onClick={() => navigate("/checkout")}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}