import { useEffect, useState } from "react";
import api from "../api/axios";
import { useParams, Link } from "react-router-dom";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  //  fetch single product
  const loadProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
      
    } catch (err) {
      console.error("Error fetching product:", err);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  if (!product) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/*  BACK BUTTON */}
      <Link
        to="/"
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        ← Back
      </Link>

      <div className="grid md:grid-cols-2 gap-6">

        {/*  IMAGE */}
        <img
          src={product.image || "https://via.placeholder.com/300"}
          alt={product.title}
          className="w-full h-80 object-cover rounded"
        />

        {/*  DETAILS */}
        <div>
          <h2 className="text-3xl font-bold mb-3">
            {product.title}
          </h2>

          <p className="text-gray-600 mb-3">
            {product.description}
          </p>

          <p className="text-lg font-semibold mb-2">
            Category: {product.category}
          </p>

          <p className="text-xl text-green-600 font-bold mb-3">
            ₹ {product.price}
          </p>

          <p className="mb-4">
            Stock: {product.stock}
          </p>

          <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}