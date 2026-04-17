import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Product_img from "../assets/products.webp";
import { useNavigate } from "react-router-dom";

// Custom Check Icon for Product Selection
const CheckIcon = ({ checked }) => (
  <div
    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
      checked
        ? "bg-green-600 border-green-600"
        : "bg-white border-gray-400"
    }`}
  >
    {checked && (
      <svg
        className="w-4 h-4 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
      </svg>
    )}
  </div>
);

// Loading Spinner Component
const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


function Tayment() {
  const navigate = useNavigate();

  const productOptions = [
    { id: 1, title: " ১ টি গ্লুটাথাইয়ন ক্রীম   ", price: 5000, quantity: 1 },
    { id: 2, title: "২ টি গ্লুটাথাইয়ন ক্রীম          " , price: 1000, quantity: 2 },
  ];

  const [selectedProduct, setSelectedProduct] = useState(productOptions[0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [shipping, setShipping] = useState(100);
  const [loading, setLoading] = useState(false); 

  const [nameError, setNameError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const total = selectedProduct.price + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const cleanPhone = phone.replace(/\D/g, "");

    setNameError("");
    setAddressError("");
    setPhoneError("");

    let isValid = true;

    if (!name.trim()) {
      setNameError("আপনার নাম is required");
      isValid = false;
    }
    if (!address.trim()) {
      setAddressError("আপনার পূর্ণ ঠিকানা is required");
      isValid = false;
    }
    if (cleanPhone.length === 0) {
      setPhoneError("আপনার মোবাইল নাম্বার is required");
      isValid = false;
    } else if (cleanPhone.length !== 11) {
      setPhoneError("অনুগ্রহ করে সঠিক ১১ সংখ্যার ফোন নাম্বার দিন।");
      isValid = false;
    }

    if (!isValid) {
      toast.error("অনুগ্রহ করে সকল * চিহ্নিত ঘর পূরণ করুন।");
      setLoading(false);
      return;
    }

    const orderData = {
      name: name.trim(),
      phone: cleanPhone,
      address: address.trim(),
      product: selectedProduct.title,
      quantity: selectedProduct.quantity,
      price: selectedProduct.price,
      shipping,
      total,
      paymentMethod: "Cash on delivery",
    };

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const errorDetail = await res.json().catch(() => ({ message: "Unknown server error." }));
        throw new Error(`Server error: ${res.status} - ${errorDetail.message}`);
      }

      const saved = await res.json();
      console.log("Raw saved response:", saved);

      // Check for order ID
      const order = saved.order || saved.user || saved;
      if (order && order._id) {
        localStorage.setItem(`order-${order._id}`, JSON.stringify(order));
        toast.success("অর্ডার সম্পন্ন হয়েছে!");
        navigate(`/order-confirm/${order._id}`);
      } else {
        toast.error("Order ID not found. Please try again.");
      }

    } catch (err) {
      console.error("Order failed:", err);
      toast.error("অর্ডার সম্পন্ন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 border border-green-600 rounded-xl shadow-2xl">
      <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-10 text-center">
        🚀 অর্ডার করতে নিচের ফর্মটি পূরণ করুন
      </h2>

      {/* Product Select */}
      <div className="flex flex-wrap gap-4 mb-4 md:mb-8">
        {productOptions.map((p) => (
          <label
            key={p.id}
            className={`flex-1 min-w-2 md:min-w-2 flex items-center border-2 rounded-xl p-4 md:p-4 cursor-pointer transition-all duration-300 ${
              selectedProduct.id === p.id
                ? "border-green-600 bg-green-50 shadow-xl"
                : "border-gray-300 bg-white hover:border-green-400"
            }`}
            onClick={loading ? (e) => e.preventDefault() : () => setSelectedProduct(p)}
          >
            {/* Custom Check Icon */}
            <CheckIcon checked={selectedProduct.id === p.id}   />

            <img src={Product_img} alt="" className="w-10 h-10 lg:w-16  lg:h-16 rounded-lg" /> {/* Smaller size, no shadow */}

            <div className="flex-1">
              <p className="font-bold text-gray-900 text-base md:text-lg">{p.title}</p>
              <p className="font-extrabold text-green-700 text-sm md:text-2xl">{p.price}.00৳</p>
            </div>
          </label>
        ))}
      </div>

      {/* Form & Summary */}
      <div className="flex flex-col lg:flex-row lg:justify-between gap-8 md:gap-12">

        {/* FORM */}
        <form id="orderForm" onSubmit={handleSubmit} className="flex-1 space-y-5 md:space-y-6">
          <h3 className="text-xl md:text-sm font-bold mb-4 text-green-700 border-b pb-2">
                        Billing details
          </h3>

          {/* NAME */}
          <div>
            <label className="block font-bold text-black text-left">আপনার নাম <span className="text-red-500">*</span></label>
            <input
              type="text"
              className={`w-full border p-3 rounded-lg text-black placeholder-gray-500 focus:ring-green-500 focus:border-green-500 ${nameError ? "border-red-500" : "border-gray-300"}`}
              placeholder="আপনার পূর্ণ নাম"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
            {nameError && <p className="text-red-600 text-sm">{nameError}</p>}
          </div>

          {/* PHONE */}
          <div>
            <label className="block  font-bold text-black text-left">আপনার মোবাইল নাম্বার <span className="text-red-500">*</span></label>
            <input
              type="text"
              maxLength="11"
              className={`w-full border p-3 rounded-lg text-black placeholder-gray-500 focus:ring-green-500 focus:border-green-500 ${phoneError ? "border-red-500" : "border-gray-300"}`}
              placeholder="১১ সংখ্যার ফোন নাম্বার"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              disabled={loading}
            />
            {phoneError && <p className="text-red-600 text-sm">{phoneError}</p>}
          </div>

          {/* ADDRESS */}
          <div>
            <label className="block font-bold text-black text-left">আপনার পূর্ণ ঠিকানা <span className="text-red-500">*</span></label>
            <input
              type="text"
              className={`w-full border p-3 rounded-lg text-black placeholder-gray-500 focus:ring-green-500 focus:border-green-500 ${addressError ? "border-red-500" : "border-gray-300"}`}
              placeholder="গ্রাম/বাসা, পোস্ট অফিস, থানা, জেলা"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={loading}
            />
            {addressError && <p className="text-red-600 text-sm">{addressError}</p>}
          </div>

          {/* SHIPPING */}
          <div className="pt-4 border-t">
            <label className={`flex justify-between p-3 border-2 rounded-lg mb-3 cursor-pointer ${shipping === 100 ? "border-green-600 bg-green-50 text-black" : "border-gray-300 text-black"}`}>
              <div className="flex items-center">
                <input type="radio" name="shipping" checked={shipping === 100} onChange={() => setShipping(100)} className="mr-3 text-black" disabled={loading} />
                ঢাকার বাইরে ডেলিভারি:
              </div>
              <span className="font-bold text-green-700">100৳</span>
            </label>

            <label className={`flex justify-between p-3 border-2 rounded-lg cursor-pointer ${shipping === 60 ? "border-green-600 bg-green-50 text-black" : "border-gray-300 text-black"}`}>
              <div className="flex items-center">
                <input type="radio" name="shipping" checked={shipping === 60} onChange={() => setShipping(60)} className="mr-3" disabled={loading} />
                ঢাকার ভিতরে ডেলিভারি:
              </div>
              <span className="font-bold text-green-700">60৳</span>
            </label>
          </div>

      
        </form>

        {/* SUMMARY */}
        <div className="md:w-[450px] border rounded-xl p-6 shadow-xl bg-white sticky top-4">
          <h3 className="text-xl md:text-2xl font-bold mb-4 text-black border-b pb-2">
       🛒 আপনার অর্ডারসমূহ          </h3>

          <div className="flex justify-between py-3 font-semibold border-b text-gray-600">
            <span className=" text-black">Product</span>
            <span className="text-black">Subtotal</span>
          </div>

          <div className="flex justify-between py-3">
            <span className="text-black">{selectedProduct.title} × {selectedProduct.quantity}</span>
            <span className="text-black">{selectedProduct.price}৳</span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-black">Subtotal</span>
            <span className="text-black">{selectedProduct.price}৳</span>
          </div>

          <div className="flex justify-between py-2 border-b">
            <span className="text-black">Shipping</span>
            <span className="text-black">{shipping}৳</span>
          </div>

          <div className="flex justify-between pt-4 text-xl md:text-2xl font-extrabold text-green-800">
            <span className="text-black">Total</span>
            <span className="text-black">{total}৳</span>
          </div>

          {/* COD INFO */}
          <div className="bg-green-50 border p-4 rounded-lg mt-6">
            <h4 className="text-lg font-bold text-green-700 mb-2">Cash on delivery</h4>
            <p className="text-black">অগ্রিম কোনো টাকা দিতে হবে না, পণ্য হাতে পেয়ে ডেলিভারি ম্যান কে পেমেন্ট করতে পারবেন</p>
          </div>

          {/* DESKTOP BUTTON (Lock Icon Included) */}
          {/* MOBILE BUTTON (Lock Icon Included) */}
          <div className="mt-6">
            <button 
                type="submit" 
                form="orderForm"
                disabled={loading} 
                className="w-full flex items-center justify-center bg-green-700 text-white text-xl font-bold py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-800 transition duration-200"
            >
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Place Order {total}.00৳
                    </>
                )}
            </button>
          </div>
        </div>
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default Tayment;