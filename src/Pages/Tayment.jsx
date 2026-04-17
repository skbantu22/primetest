import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Product_img from "../assets/products.webp";
import { useNavigate } from "react-router-dom";

// Check Icon
const CheckIcon = ({ checked }) => (
  <div
    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
      checked ? "bg-green-600 border-green-600" : "bg-white border-gray-400"
    }`}
  >
    {checked && (
      <svg
        className="w-4 h-4 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          d="M5 13l4 4L19 7"
        />
      </svg>
    )}
  </div>
);

// Spinner
const LoadingSpinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

function Tayment() {
  const navigate = useNavigate();

  const productOptions = [
    { id: 1, title: "১ টি গ্লুটাথাইয়ন ক্রীম", price: 500, quantity: 1 },
    { id: 2, title: "২ টি গ্লুটাথাইয়ন ক্রীম", price: 1000, quantity: 2 },
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
      setNameError("আপনার নাম required");
      isValid = false;
    }

    if (!address.trim()) {
      setAddressError("আপনার ঠিকানা required");
      isValid = false;
    }

    if (cleanPhone.length !== 11) {
      setPhoneError("১১ সংখ্যার সঠিক ফোন নাম্বার দিন");
      isValid = false;
    }

    if (!isValid) {
      toast.error("সব তথ্য সঠিকভাবে পূরণ করুন");
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

      const data = await res.json();

      const order = data.order || data;

      if (order?._id) {
        toast.success("Order placed successfully!");
        navigate(`/order-confirm/${order._id}`);
      } else {
        toast.error("Order failed!");
      }
    } catch (err) {
      toast.error("Server error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 border border-green-600 rounded-xl shadow-xl mt-2 lg:mt-5  text-black ">
      
      <h2 className="text-xl md:text-3xl font-bold text-center mb-8 text-black">
        🚀 অর্ডার করতে নিচের ফর্মটি পূরণ করুন
      </h2>

      {/* PRODUCT SECTION */}
      <div className="flex flex-col gap-4 mb-6">
        {productOptions.map((p) => (
          <label
            key={p.id}
            className={`flex items-center gap-3 border-2 rounded-xl p-3 cursor-pointer transition-all ${
              selectedProduct.id === p.id
                ? "border-green-600 bg-green-50"
                : "border-gray-300"
            }`}
            onClick={loading ? undefined : () => setSelectedProduct(p)}
          >
            <CheckIcon checked={selectedProduct.id === p.id} />

            <img
              src={Product_img}
              className="w-12 h-12 md:w-16 md:h-16 rounded"
            />

            <div className="flex-1">
              <p className="font-bold  text-black ">{p.title}</p>
              <p className="text-green-700 font-extrabold  text-black ">{p.price}৳</p>
            </div>
          </label>
        ))}
      </div>

      {/* MAIN SECTION */}
      <div className="flex flex-col lg:flex-row gap-8">

        {/* FORM */}
        <form
          id="orderForm"
          onSubmit={handleSubmit}
          className="flex-1 space-y-4 md:space-y-6"
        >
          <h3 className="text-xl md:text-2xl font-bold text-green-700 border-b pb-2">
            Billing details
          </h3>

          <input
            className="w-full border p-3 rounded  text-black "
            placeholder="আপনার নাম"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {nameError && <p className="text-red-500">{nameError}</p>}

          <input
            className="w-full border p-3 rounded"
            placeholder="মোবাইল নাম্বার"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value.replace(/\D/g, ""))
            }
            maxLength={11}
          />
          {phoneError && <p className="text-red-500">{phoneError}</p>}

          <input
            className="w-full border p-3 rounded"
            placeholder="ঠিকানা"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          {addressError && <p className="text-red-500">{addressError}</p>}

          {/* SHIPPING */}
          <div className="border-t pt-4 space-y-2">
            <label className="flex justify-between border p-3 rounded cursor-pointer  text-black ">
              <div>
                <input
                  type="radio"
                  checked={shipping === 100}
                  onChange={() => setShipping(100)}
                />{" "}
                ঢাকার বাইরে
              </div>
              100৳
            </label>

            <label className="flex justify-between border p-3 rounded cursor-pointer  text-black ">
              <div>
                <input
                  type="radio"
                  checked={shipping === 60}
                  onChange={() => setShipping(60)}
                />{" "}
                ঢাকার ভিতরে
              </div>
              60৳
            </label>
          </div>
        </form>

        {/* SUMMARY */}
        <div className="w-full lg:w-[400px] border rounded-xl p-5 shadow-lg">
          <h3 className="text-xl font-bold mb-4">🛒 Order Summary</h3>

          <div className="flex justify-between border-b pb-2">
            <span>{selectedProduct.title}</span>
            <span>{selectedProduct.price}৳</span>
          </div>

          <div className="flex justify-between py-2">
            <span>Shipping</span>
            <span>{shipping}৳</span>
          </div>

          <div className="flex justify-between font-bold text-green-700 text-xl pt-2">
            <span>Total</span>
            <span>{total}৳</span>
          </div>

          <button
            type="submit"
            form="orderForm"
            disabled={loading}
            className="w-full mt-5 bg-green-700 text-white py-3 rounded font-bold flex justify-center items-center"
          >
            {loading ? <LoadingSpinner /> : `Place Order ${total}৳`}
          </button>
        </div>
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default Tayment;