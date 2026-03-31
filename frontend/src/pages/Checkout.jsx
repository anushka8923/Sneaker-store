import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Load Cart
  const loadCart = async () => {
    try {
      const res = await api.get(`/cart/${userId}`);
      setCart(res.data);
    } catch (err) {
      console.error("Error loading cart:", err);
    }
  };

  // ✅ Load Addresses
  const loadAddresses = async () => {
    try {
      const res = await api.get(`/address/${userId}`);
      setAddresses(res.data);
    } catch (err) {
      console.error("Error loading addresses:", err);
    }
  };

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    loadCart();
    loadAddresses();
  }, []);

  // 💰 Total Price
  const totalPrice =
    cart?.items?.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    ) || 0;

  // ✅ 🚀 REAL ORDER PLACE FUNCTION
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select an address ❌");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/order/place", {
        userId,
        addressId: selectedAddress,
        paymentMethod: "COD",
      });

      console.log("ORDER RESPONSE:", res.data);

      alert("Order placed successfully ✅");

      // ✅ Clear cart after order
      //await api.delete(`/cart/clear/${userId}`);

      // redirect to home
      navigate("/order-success");

    } catch (err) {
      console.error("Order error:", err);
      alert(err.response?.data?.message || "Order failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // ❌ Empty Cart
  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center mt-10 text-xl">
        🛒 Cart is empty
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 grid md:grid-cols-2 gap-8">

      {/* 🛒 LEFT: Cart Summary */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

        <div className="space-y-3">
          {cart.items.map((item) => (
            <div
              key={item._id}
              className="flex justify-between border p-3 rounded"
            >
              <div>
                <h3 className="font-semibold">
                  {item.product.title}
                </h3>
                <p>Qty: {item.quantity}</p>
              </div>

              <p className="font-semibold">
                ₹{item.product.price * item.quantity}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 text-right">
          <h3 className="text-xl font-bold">
            Total: ₹{totalPrice}
          </h3>
        </div>
      </div>

      {/* 📍 RIGHT: Address Selection */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Select Delivery Address
        </h2>

        {addresses.length === 0 ? (
          <p>No addresses found. Please add one.</p>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <label
                key={addr._id}
                className="border p-3 rounded block cursor-pointer"
              >
                <input
                  type="radio"
                  name="address"
                  value={addr._id}
                  onChange={() => setSelectedAddress(addr._id)}
                  className="mr-2"
                />

                <div>
                  <p className="font-semibold">
                    {addr.fullName}
                  </p>
                  <p>{addr.street}</p>
                  <p>
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p>{addr.phone}</p>
                </div>
              </label>
            ))}
          </div>
        )}

        {/* ➕ Add Address */}
        <button
          onClick={() => navigate("/checkout/address")}
          className="mt-4 text-blue-500 hover:underline"
        >
          + Add New Address
        </button>

        {/* 🚀 Place Order */}
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full mt-6 bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}