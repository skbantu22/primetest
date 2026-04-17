import React from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaHome, FaCreditCard, FaTags, FaChartBar, FaCog } from "react-icons/fa";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
    const menuItems = [
        { name: "Home", icon: FaHome, path: "/app/allorders" },
        { name: "Orders", icon: FaCreditCard, path: "/app/orders", count: 12 },
        { name: "Customers", icon: FaTags, path: "/app/orders" },
        { name: "Coupons", icon: FaTags, path: "/app/orders" },
        { name: "Reports", icon: FaChartBar, path: "/app/orders" },
        { name: "Settings", icon: FaCog, path: "/app/orders" },
        { name: "Payments", icon: FaCreditCard, path: "/app/orders" },
    ];

    return (
        <div 
            className={`fixed inset-y-0 left-0 w-64 bg-[#23282d] text-gray-300 z-40 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:w-64 shadow-xl overflow-y-auto`}
        >
            {/* Sidebar header */}
            <div className="p-4 flex justify-between items-center text-white bg-[#1d2125] sticky top-0">
                <button onClick={toggleSidebar} className="md:hidden">
                    <FaBars size={20} />
                </button>
            </div>

            {/* Menu */}
            <ul className="py-2">
                {menuItems.map((item, index) => (
                    <li key={index} className="px-2">
                        <NavLink
                            to={item.path}
                            className={({ isActive }) => 
                                `flex items-center p-3 hover:bg-[#32373c] transition-colors duration-150 
                                ${isActive 
                                    ? "text-gray-4000 text-white " // Active state
                                    : "bg-blue-600"}`
                            }
                        >
                            <item.icon className="mr-3" />
                            <span className="flex-1">{item.name}</span>

                            {item.count && (
                                <span className="bg-red-600 text-white text-xs px-2 rounded-full">
                                    {item.count}
                                </span>
                            )}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
