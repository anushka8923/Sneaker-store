import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CheckoutAddress() {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    street: "",
    city: "",
    state: "",
    country: "India",
    isDefault: true,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // submit address
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setMessage("User not logged in ❌");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

    const res = await api.post("/address/add", {
  userId,
  fullName: form.fullName,
  phone: form.phone,
  pincode: form.pincode,
  street: form.street,
  city: form.city,
  state: form.state,
  country: form.country,
  isDefault: form.isDefault,
    });

      setMessage("Address saved successfully ✅");

      console.log(res.data);

      // optional: redirect to cart or next step
      setTimeout(() => {
        navigate("/cart");
      }, 1000);

    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message || "Failed to save address ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Checkout Address
      </h2>

      {message && (
        <p className="text-center mb-4 text-blue-600">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={form.pincode}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <textarea
          name="street"
          placeholder="Street Address"
          value={form.street}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="country"
          placeholder="Country"
          value={form.country}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {/* Default Address */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isDefault"
            checked={form.isDefault}
            onChange={handleChange}
          />
          Set as default address
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {loading ? "Saving..." : "Save Address"}
        </button>
      </form>
    </div>
  );
}