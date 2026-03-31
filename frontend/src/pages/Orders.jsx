import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Orders() {
  const userId = localStorage.getItem("userId");

  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    try {
      const res = await api.get(`/order/user/${userId}`);
      setOrders(res.data);
    } catch (err) {
      console.error("Error loading orders:", err);
    }
  };

  useEffect(() => {
    if (userId) {
      loadOrders();
    }
  }, []);

  if (!orders.length) {
    return (
      <div className="text-center mt-10 text-xl">
        No orders found 📦
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="border p-4 rounded shadow">

            {/* Order Info */}
            <div className="mb-3">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <p><strong>Payment:</strong> {order.paymentMethod}</p>
              <p><strong>Total:</strong> ₹{order.totalAmount}</p>
            </div>

            {/* Address */}
            <div className="mb-3">
              <p className="font-semibold">Delivery Address:</p>
              <p>{order.address?.fullName}</p>
              <p>{order.address?.street}</p>
              <p>
                {order.address?.city}, {order.address?.state} - {order.address?.pincode}
              </p>
              <p>{order.address?.phone}</p>
            </div>

            {/* Products */}
            <div>
              <p className="font-semibold mb-2">Items:</p>

              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between border-b py-2"
                >
                  <span>{item.product?.title}</span>
                  <span>Qty: {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}