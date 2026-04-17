import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Product_img from "../assets/products.png";
import { useNavigate } from "react-router-dom";

// ... (ProductItem component remains the same)
const ProductItem = ({ name, subtext, total, quantity }) => (
  <div className="flex justify-between py-2 border-b border-gray-200">
    <div className="flex items-center space-x-3">
      <div className="w-12 h-12 bg-gray-200 rounded shrink-0">
        <img src={Product_img} alt="" className="w-full h-full object-cover" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700">{name}</p>
        {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
      </div>
    </div>
    <div className="flex items-center text-sm font-medium text-gray-800">
      <span className="mr-4 text-xs font-normal text-gray-600">× {quantity}</span>
      <span>৳ {total.toFixed(2)}</span>
    </div>
  </div>
);

function Tayment() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState(1);
  // NEW STATE for phone validation error message
  const [phoneError, setPhoneError] = useState(""); 

  const price = 999; // price per product
  const shippingCharge = 0; // delivery is free
  const productName = "প্রাইম ল্যাবস প্রাইম টেস্ট অর্গানিক ব্ল্যাক মাকা 1200 ML";
  const productSubtext = "";

  const total = quantity * price; // total excludes shipping

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  // NEW VALIDATION FUNCTION
  const validatePhone = (phoneNumber) => {
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length !== 11) {
      setPhoneError("অনুগ্রহ করে সঠিক ১১ সংখ্যার ফোন নাম্বার দিন।");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handlePhoneChange = (e) => {
    // Keep only digits in the input
    const newPhone = e.target.value.replace(/[^0-9]/g, "");
    setPhone(newPhone);
    // Validate on change
    validatePhone(newPhone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Re-validate just before submission
    if (!validatePhone(phone)) {
      // Toast message will be shown if validation fails
      toast.error("অনুগ্রহ করে সঠিক ১১ সংখ্যার ফোন নাম্বার দিন।");
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "");

    const orderData = {
      name,
      phone: cleanPhone,
      address,
      product: productName,
      shipping: shippingCharge,
      total,
      quantity,
      payment: "Cash on delivery",
    };

    console.log("Submitting order:", orderData);

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("Server error");

      const savedOrder = await res.json();
      localStorage.removeItem("orderDraft");

      const orderDetails = {
        _id: savedOrder.order._id,
        date: new Date().toISOString(),
        total,
        product: productName,
        quantity,
        payment: "Cash on delivery",
        billingAddress: { name, addressLine1: address, phone: cleanPhone },
        shippingAddress: address,
      };

      localStorage.setItem(`order-${savedOrder.order._id}`, JSON.stringify(orderDetails));
      toast.success("অর্ডার সফলভাবে সম্পন্ন হয়েছে!");

      navigate(`/order-confirm/${savedOrder.order._id}`);
    } catch (err) {
      console.error("Order submission failed:", err);
      toast.error("অর্ডার সম্পন্ন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    }
  };

  return (
    <div id="orderform" className="min-h-screen bg-gray-50 text-black">
      <div className="bg-emerald-600 text-center py-4 text-white text-xl font-bold rounded-md mb-6 mt-2">
        অর্ডার করতে নিচের ফর্মটি পূরণ করুন
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 shadow-xl shadow-gray-700/60 p-3">
        {/* LEFT SECTION (omitted for brevity, assume content is here) */}
        <div className="space-y-6">
          {/* Product Box (omitted for brevity, assume content is here) */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Products</h2>
            <div className="border rounded-lg p-4 flex items-center gap-4 bg-white">
              <input type="checkbox" checked readOnly className="w-4 h-4" />
              <div className="w-16 h-16 flex items-center justify-center">
                <img src={Product_img} alt="" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{productName} × {quantity}</h3>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    type="button"
                    className="px-3 py-1 border border-gray-300 rounded-l"
                  >-</button>
                  <input
                    value={quantity}
                    readOnly
                    className="w-10 text-center border-t border-b border-gray-300 text-black"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    type="button"
                    className="px-3 py-1 border border-gray-300 rounded-r"
                  >+</button>
                  <span className="ml-4 font-semibold">৳{(quantity * price).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Billing Form */}
          <div>
            <h2 className="mb-6 text-xl font-bold text-gray-800">
              আপনার নাম, ঠিকানা ও ফোন নাম্বার দিন।
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 bg-white p-4 rounded-lg border text-black"
            >
              {/* Name Input (omitted for brevity) */}
              <div>
                <label className="block mb-1 font-medium">আপনার নাম</label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="আপনার নাম লিখুন"
                  className="w-full border rounded p-2 lg:p-4 text-black placeholder-black"
                />
              </div>

              {/* UPDATED Phone Number Input */}
              <div>
                <label className="block mb-1 font-medium">আপনার ফোন নাম্বার *</label>
                <input
                  onChange={handlePhoneChange} // Use the new handler
                  value={phone}
                  type="text"
                  maxLength="11"
                  placeholder="আপনার ফোন নাম্বার লিখুন"
                  // Conditionally apply a red border if there's an error
                  className={`w-full border rounded p-2 lg:p-4 text-black placeholder-black ${phoneError ? 'border-red-500 ring-red-500' : 'border-gray-300'}`}
                />
                {/* Red error message paragraph */}
                {phoneError && (
                  <p className="text-red-600 text-sm mt-1">{phoneError}</p>
                )}
              </div>

              {/* Address Input (omitted for brevity) */}
              <div>
                <label className="block mb-1 font-medium">আপনার ঠিকানা</label>
                <input
                  onChange={(e) => setAddress(e.target.value)}
                  type="text"
                  placeholder="আপনার ঠিকানা লিখুন"
                  className="w-full border rounded p-2 lg:p-5 text-black placeholder-black"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition"
              >
                🔒 অর্ডার সম্পন্ন করুন ৳{total.toFixed(2)}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT SECTION (omitted for brevity, assume content is here) */}
        <div className="hidden lg:block lg:mt-9">
          <div className="p-4 mb-4 rounded-lg bg-gray-50 border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center w-full">
              <div className="shrink-0 mr-4">
                <div className="w-16 h-20 sm:w-20 sm:h-20 border border-gray-300 rounded bg-white">
                  <img src={Product_img} alt="" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex-grow">
                <p className="text-base text-gray-800 leading-snug">
                  {productName} <span className="text-xl font-bold ml-1 text-gray-600">×{quantity}</span>
                </p>
                <p className="text-lg font-bold mt-1 text-gray-900">৳ {total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <h2 className="mb-4 text-xl font-bold text-gray-800">আপনার টোটাল অর্ডার</h2>
          <div className="flex justify-between pb-2 text-sm font-semibold text-gray-500 border-b border-gray-300">
            <span>Product</span>
            <span>Subtotal</span>
          </div>
          <ProductItem name={productName} subtext={productSubtext} total={quantity * price} quantity={quantity} />
          <div className="pt-4 space-y-2 text-gray-800">
            <div className="flex justify-between text-base">
              <span>Subtotal</span>
              <span className="font-semibold">৳ {quantity * price}</span>
            </div>
            <div className="flex justify-between pt-2 text-lg font-semibold text-gray-900">
              <span>Total</span>
              <span className="font-semibold">৳ {total}</span>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Tayment;