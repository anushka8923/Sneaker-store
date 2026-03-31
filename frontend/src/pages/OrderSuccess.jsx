import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();

  // ⏳ Auto redirect after 3 sec
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
      
      {/* ✅ Success Icon */}
      <div className="text-green-500 text-6xl mb-4">
        ✅
      </div>

      {/* 🎉 Heading */}
      <h1 className="text-3xl font-bold mb-2">
        Order Placed Successfully!
      </h1>

      {/* 🧾 Message */}
      <p className="text-gray-600 mb-6">
        Thank you for your purchase. Your order has been placed successfully.
      </p>

      {/* 🔄 Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Go to Home
        </button>

        <button
          onClick={() => navigate("/orders")}
          className="bg-gray-200 px-6 py-2 rounded hover:bg-gray-300"
        >
          View Orders
        </button>
      </div>

      {/* ⏳ Auto Redirect Info */}
      <p className="mt-6 text-sm text-gray-400">
        Redirecting to home in 3 seconds...
      </p>
    </div>
  );
}