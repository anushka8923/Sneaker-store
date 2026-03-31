import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Navbar() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  const userId = localStorage.getItem("userId");

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("userId");
    alert("Logged out successfully");
    navigate("/login");
  };

  // 🛒 Load cart count
  const loadCart = async () => {
    try {
      if (!userId) return;

      const res = await api.get(`/cart/${userId}`);

      const items = res.data?.items || [];

      console.log("CART DATA:", items); // 👈 debug

      // ✅ FIXED COUNT LOGIC
      const total = items.reduce((sum, item) => {
        return sum + (item.quantity ? item.quantity : 1);
      }, 0);

      setCartCount(total);

    } catch (err) {
      console.log("Cart error:", err);
    }
  };

  // ✅ Run on load
  useEffect(() => {
    loadCart();
  }, [userId]);

  // ✅ AUTO REFRESH (IMPORTANT FIX 🔥)
  useEffect(() => {
    const interval = setInterval(() => {
      loadCart();
    }, 1000); // every 1 sec

    return () => clearInterval(interval);
  }, [userId]);

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      
      {/* 🔵 Logo */}
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        MyStore
      </h1>

      {/* 🔗 Links */}
      <div className="flex gap-6 items-center">
        
        <Link to="/" className="hover:text-gray-300">
          Home
        </Link>

        <Link to="/admin/products" className="hover:text-gray-300">
          Admin
        </Link>

        {/* 📦 My Orders */}
        {userId && (
          <button
            onClick={() => navigate("/orders")}
            className="hover:text-gray-300"
          >
            My Orders
          </button>
        )}

        {/* 🔐 Auth */}
        {userId ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="hover:text-gray-300">
              Login
            </Link>
            <Link to="/signup" className="hover:text-gray-300">
              Signup
            </Link>
          </>
        )}

        {/* 🛒 Cart */}
        <div
          className="relative cursor-pointer"
          onClick={() => navigate("/cart")}
        >
          🛒

          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-xs px-2 py-0.5 rounded-full">
              {cartCount}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}