// import React, { useState } from "react";
// import { FaPhoneAlt, FaWhatsapp, FaShoppingCart, FaSpinner } from "react-icons/fa";
// import Tayment from "./Tayment";
// import PrimeTestFAQ from "./PrimeTestFAQ ";
// import { Link } from 'react-scroll';
// import Photo2 from "./Photo2";



// export default function Checkout() {
//   const [formData, setFormData] = useState({
//     name: "",
//     address: "",
//     phone: "",
//   });

//    const [quantity, setQuantity] = useState(1);
//     const price = 999;
//     const total = quantity * price;
//     const [paymentMethod, setPaymentMethod] = useState("cod");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setLoading(true);

//     // Simulate API delay (e.g. saving order)
//     setTimeout(() => {
//       setLoading(false);
//       alert("✅ অর্ডার সফলভাবে গ্রহণ করা হয়েছে!");
//       setFormData({ name: "", address: "", phone: "" });
//     }, 2500);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center p-2">

//  <Photo2 />
//       {/* Animated Offer Text */}
//       <div className="text-center text-2xl font-bold animate-bounce text-green-600">
//         শুধুমাত্র আজকের জন্য অফার প্রাইস <span className="text-red-600">৳৯৯৯</span>
//         <br /> সাথে ডেলিভারি চার্জ সম্পূর্ণ ফ্রী 🎉
//       </div>

//  <div className="w-full flex justify-center sm:justify-start lg:justify-center my-4 px-4">
//   <Link
//     to="orderform"        // target id
//     smooth={true}          // smooth scrolling
//     duration={500}         // scroll duration in ms
//     className="cursor-pointer py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full flex items-center justify-center text-base sm:text-lg lg:text-xl shadow-xl transition-transform transform hover:scale-105"
//   >
//     <span className="text-2xl sm:text-xl lg:text-2xl mr-2">🛒</span> অর্ডার করতে ক্লিক করুন
//   </Link>
// </div>




// <PrimeTestFAQ />

// <Tayment />

//       {/* Footer */}
//       <footer className="mt-10 text-sm text-gray-600 font-semibold">
//         Copyright © 2025 | All Rights Reserved
//       </footer>
//     </div>
//   );
// }