import React from 'react';

// --- SVG Icon for Checkmark ---
// Using an inline SVG for the green checkmark
// This is small, so we can keep it separate


// --- Main App Component ---
// All design is now inside this one function
export default function App() {


  return (
    <>
      {/* We apply the font to the body */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;700&display=swap');
        body { font-family: 'Noto Sans Bengali', 'Inter', sans-serif; }
      `}</style>
      
      {/* Main Background Div (Green) */}
      <div 
        className="flex flex-col items-center justify-center min-h-screen sm:p-12 md:p-16 lg:max-w-8xl p-4"
        style={{ backgroundColor: '#b5e0b5' }} // Light green background
      >
        {/* White Page Div - This holds all the content */}
        
      </div>
    </>
  );
}