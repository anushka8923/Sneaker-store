import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  // 👉 TEMP userId (later login se aayega)
  const userId = localStorage.getItem("userId");

  // ✅ Load products (search + category)
  const loadProducts = async (searchText = "", cat = "") => {
    try {
      const res = await api.get(
        `/products?search=${searchText}&category=${cat}`
      );
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // ✅ Initial load + category change
  useEffect(() => {
    loadProducts("", category);
  }, [category]);

  // ✅ Search submit
  const handleSearch = (e) => {
    e.preventDefault();
    loadProducts(search, category);
  };

  // ✅ Add to Cart
  const addToCart = async (productId) => {
    try {
      await api.post("/cart/add", {
        userId,
        productId,
        quantity: 1,
      });
      alert("Added to cart ✅");
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* 🔍 SEARCH + CATEGORY */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded"
        />

        {/* 📂 CATEGORY DROPDOWN */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">All Categories</option>
          <option value="Laptops">Laptops</option>
          <option value="Mobiles">Mobiles</option>
          <option value="Electronics">Electronics</option>
        </select>

        <button className="bg-blue-500 text-white px-4 rounded">
          Search
        </button>
      </form>

      {/* 🛍️ PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <p>No products found</p>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              className="border p-4 rounded shadow hover:shadow-lg transition"
            >
              <img
                src={product.image || "https://via.placeholder.com/150"}
                alt={product.title}
                className="w-full h-40 object-cover mb-3"
              />

              <h3 className="text-lg font-bold">{product.title}</h3>

              <p className="text-gray-600 text-sm mb-2">
                {product.description}
              </p>

              <p className="font-semibold text-green-600">
                ₹ {product.price}
              </p>

              {/* 🔗 DETAILS */}
              <Link
                to={`/product/${product._id}`}
                className="block mt-3 text-blue-500 hover:underline"
              >
                View Details
              </Link>

              {/* 🛒 ADD TO CART */}
              <button
                onClick={() => addToCart(product._id)}
                className="mt-2 w-full bg-blue-500 text-white py-1 rounded hover:bg-blue-600"
              >
                Add to Cart
              </button>

            </div>
          ))
        )}
      </div>
    </div>
  );
}