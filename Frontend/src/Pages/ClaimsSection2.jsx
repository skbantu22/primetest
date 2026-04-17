import React from 'react';
import { Link } from 'react-scroll';
import Photo1 from '../assets/Photo1.webp';
import App from './swiper';
import Tayment from './Tayment';
import { FaHandPointLeft } from "react-icons/fa";

function ClaimsSection2() {

  const highlights = [
    "স্কিনকে ব্রাইটেনিং করে।",
    "ইন্সট্যান্ট টোন আপ লুক দেয়।",
    "স্কিনকে ময়েশ্চারাইজ ও হাইড্রেটিং রাখে।",
    "রিংকেল দূর করে।",
    "এন্টি এজিং কাজ করে।",
    "ফ্রিকেলস, পিগমেন্টেশন, হালকা মেছতা দূর করে।",
    "ত্বকের কালচে ভাব দূর করে।",
    "স্কিনের ডার্ক স্পট, হালকা একনে স্পট দূর করে।",
    "ডার্ক সারকেল দূর করে।",
    "ত্বক থেকে বয়সের ছাপ দূর করে",
    "ত্বককে করবে প্রাণবন্ত ও স্বাস্থ্যজ্জ্বল।",
    "ডেমেজ এবং ডাল ত্বককে রিপেয়ার।",
  ];

  const CheckIcon = () => (
    <svg
      className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-1"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  return (
    <div className="bg-[#96CA96] text-white text-center p-2 sm:p-4 md:p-10 lg:max-w-8xl mx-auto rounded-lg shadow-xl">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-2xl p-4 md:p-6">

        {/* --- Header --- */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
            ১০০% কার্যকরী-প্রমাণিত
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-2">
            "Glutathione Brightening Tone Up Cream"
          </h2>
          <p className="text-red-700 font-semibold mb-4 text-sm px-2">
            এটি একটি অরিজিনাল সাউথ কোরিয়ান ব্রান্ডের প্রডাক্ট। ক্রিমটি নিয়মিত ব্যবহারে স্কিন হবে টানটান গ্লাসী, উজ্জ্বল ফর্সা, বেবী স্কিন।
          </p>
        </div>

        {/* --- Product Display --- */}
        <div className="border-4 border-green-600 bg-white rounded-lg shadow-lg overflow-hidden relative">
          <h2 className="text-center text-xl md:text-2xl font-bold text-purple-800 p-4">
            Glutathione Brightening Tone-Up Cream
          </h2>
          <div className="relative">
            <img src={Photo1} alt="Product" className="w-full h-auto object-cover" />
          </div>
        </div>

        {/* --- Order Button (Responsive) --- */}
        <Link
          to="orderform"
          smooth={true}
          duration={500}
          className="inline-block w-full sm:w-auto bg-green-600 text-white text-lg sm:text-xl font-bold py-2 px-6 sm:py-3 sm:px-8 rounded-lg shadow-md hover:bg-green-700 transition duration-300 transform hover:scale-105 mx-auto mt-6 mb-6"
        >
          স্টক সীমিত! এখনই অর্ডার করুন {'>>'}
        </Link>

        {/* --- Product Highlights (FIXED) --- */}
        <div className="w-full mt-8 p-4 md:p-6">
          <h2 className="text-2xl font-bold text-center text-green-800 border-2 border-green-600 rounded-lg py-3 px-6 mb-6">
            প্রোডাক্ট হাইলাইটস
          </h2>
          <ul className="flex flex-col gap-3 text-left">
            {highlights.map((item, index) => (
              <li
                key={index}
                className="grid grid-cols-[auto_1fr] gap-3 items-start"
              >
                <CheckIcon />
                <span className="text-green-700 font-bold text-base lg:text-lg leading-snug break-words">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* --- Second Order Button (Responsive) --- */}
        <Link
          to="orderform"
          smooth={true}
          duration={500}
          className="inline-block w-full sm:w-auto bg-green-600 text-white text-lg sm:text-xl font-bold py-2 px-6 sm:py-3 sm:px-8 rounded-lg shadow-md hover:bg-green-700 transition duration-300 transform hover:scale-105 mx-auto mt-6 mb-6"
        >
          স্টক সীমিত! এখনই অর্ডার করুন {'>>'}
        </Link>

        {/* --- WhatsApp CTA --- */}
        <div className="max-w-md mx-auto p-4 bg-white rounded-lg text-center space-y-6 mt-2">
          <h2 className="text-xl font-extrabold text-black leading-snug">
            "বিস্তারিত জানতে WhatsApp করুন:"
          </h2>
          <a
            href="https://wa.me/8801732196669"
            className="inline-flex items-center justify-center w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white font-bold rounded-md px-6 py-2 text-lg sm:text-xl transition duration-300 mx-auto"
          >
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 13.13 13.13 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 13.07 13.07 0 002.81.7 2 2 0 011.72 2z" />
            </svg>
            01732196669
          </a>
          <h2 className="text-xl font-extrabold text-black mt-4">
            গ্লোটাথায়ন প্রোডাক্ট রিভিউ
          </h2>
        </div>

        {/* --- Swiper Section --- */}
        <App />

        {/* --- Third Order Button (Responsive) --- */}
        <Link
          to="orderform"
          smooth={true}
          duration={500}
          className="inline-block w-full sm:w-auto bg-green-600 text-white text-lg sm:text-xl font-bold py-2 px-6 sm:py-3 sm:px-8 shadow-md hover:bg-green-700 transition duration-300 transform hover:scale-105 mx-auto mt-6 mb-6 rounded-br-2xl rounded-tl-2xl"
        >
          স্টক সীমিত! এখনই অর্ডার করুন {'>>'}
        </Link> {/* <-- FIXED */}

        {/* --- Pricing Boxes --- */}
        <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-8 mt-6 px-4 md:px-8">
          {/* Box 1 */}
          <div className="border-4 border-green-600 rounded-lg p-6 flex flex-col items-center justify-between shadow-lg flex-1 h-full">
            {/* Content group */}
            <div>
              <h3 className="text-2xl font-bold text-black text-center">১ টি গ্লোটাথায়ন</h3>
              <p className="text-2xl font-bold text-red-600 text-center my-2">৫০০ টাকা</p>
              <p className="text-xl font-bold text-black text-center line-through">পূর্বের মূল্য ৯৫০ টাকা</p>
            </div>
            {/* Button */}
            <Link
              to="orderform"
              smooth={true}
              duration={500}
              className="mt-4 inline-flex items-center justify-center w-full bg-green-600 hover:bg-yellow-400 text-white font-bold text-base sm:text-lg py-2 px-4 sm:py-3 sm:px-6 rounded-tl-2xl rounded-br-2xl border-2 border-green-500 transition-transform transform hover:scale-105"
            >
              অর্ডার করুন <FaHandPointLeft className="ml-2" />
            </Link> {/* <-- FIXED */}
          </div>

          {/* Box 2 */}
          <div className="border-4 border-green-600 rounded-lg p-6 flex flex-col items-center justify-between shadow-lg flex-1 h-full">
            {/* Content group */}
            <div>
              <h3 className="text-2xl font-bold text-black text-center">২ টি গ্লোটাথায়ন ক্রীম</h3>
              <p className="text-2xl font-bold text-red-600 text-center my-2">১০০০ টাকা </p>
              <p className="text-xl font-bold text-black text-center line-through">পূর্বের মূল্য ১৬০০ টাকা</p>
            </div>
            {/* Button */}
            <Link
              to="orderform"
              smooth={true}
              duration={500}
              className="mt-4 inline-flex items-center justify-center w-full bg-green-600 hover:bg-yellow-400 text-white font-bold text-base sm:text-lg py-2 px-4 sm:py-3 sm:px-6 rounded-tl-2xl rounded-br-2xl border-2 border-green-500 transition-transform transform hover:scale-105"
            >
              অর্ডার করুন <FaHandPointLeft className="ml-2" />
            </Link> {/* <-- FIXED */}
          </div>
        </div>

        {/* --- Order Form --- */}
        <div id="orderform">
          <Tayment />
        </div>

      </div>
    </div>
  );
}

export default ClaimsSection2;