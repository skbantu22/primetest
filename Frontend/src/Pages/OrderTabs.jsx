import React, { useState, useMemo } from "react";
import { 
    Eye, Edit2, X, Trash2, AlertTriangle, PlusCircle, 
    ShoppingBag, Truck, Search, ChevronLeft, ChevronRight, 
    ChevronsLeft, ChevronsRight, RotateCcw, Phone, 
    User, DollarSign, Package, MapPin, CheckCircle, Clock, List
} from 'lucide-react';

// --- CONFIGURATION ---
// Define the exhaustive list of custom statuses including 'trash'
const ALL_STATUSES = [
    { key: "processing", label: "Processing", color: "yellow-600", bg: "yellow-100", icon: Clock },
    { key: "onhold", label: "On hold", color: "gray-500", bg: "gray-200", icon: List },
    { key: "completed", label: "Completed", color: "green-600", bg: "green-100", icon: CheckCircle },
    { key: "canceled", label: "Cancelled", color: "red-500", bg: "red-100", icon: X },
    { key: "refunded", label: "Refunded", color: "indigo-500", bg: "indigo-100", icon: DollarSign },
    { key: "failed", label: "Failed", color: "red-900", bg: "red-200", icon: AlertTriangle },
    { key: "cf_accepted", label: "CF Accepted", color: "blue-500", bg: "blue-100", icon: CheckCircle }, // Main Order Accepted (CF)
    { key: "trash", label: "Trash", color: "red-400", bg: "red-50", icon: Trash2 },
];

// Sample Product Data
const PRODUCTS = [
    { name: "১ টি গ্লুটাথায়ন ক্রীম", price: 650.00, quantity: 1 },
    { name: "২ টি গ্লুটাথায়ন ক্রীম", price: 1150.00, quantity: 1 },
    { name: "Prime Test", price: 990.00, quantity: 1 }, 
];

const SHIPPING_OPTIONS = [
    { label: "ঢাকার বাইরে ডেলিভারি চার্জ", cost: 100.00, key: 'outside' },
    { label: "ঢাকার ভিতরে ডেলিভারি চার্জ", cost: 60.00, key: 'inside' },
];

// Items per page for pagination
const ITEMS_PER_PAGE = 10;

/**
 * @typedef {Object} Order
 * @property {number} id
 * @property {string} name
 * @property {string} phone
 * @property {string} status
 * @property {string} address
 * @property {number} total
 * @property {number} shipping
 * @property {string} product
 */


// --- CUSTOM COMPONENTS ---

// New: Dashboard Metric Card
const MetricCard = ({ title, count, color, icon: Icon }) => (
    <div className={`p-5 rounded-2xl bg-white shadow-lg border-l-4 border-${color}-400 transition-shadow duration-300 hover:shadow-xl`}>
        <div className="flex justify-between items-center">
            <div>
                <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
                <p className={`text-3xl font-extrabold mt-1 text-${color}-800`}>{count}</p>
            </div>
            <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
                <Icon size={24} />
            </div>
        </div>
    </div>
);


// Responsive Card for Mobile View (Made Denser)
const OrderCard = ({ order, status, handleView, isSelected, onToggleSelect }) => (
    <div className={`p-3 rounded-2xl border-2 transition-all duration-200 shadow-md 
        ${isSelected ? 'border-blue-500 bg-blue-50/70' : 'border-gray-100 bg-white hover:shadow-lg'}`}
    >
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(order.id, !isSelected)}
                    className="rounded-lg text-blue-600 h-5 w-5 border-gray-300 focus:ring-blue-500"
                />
                <div className="text-xl font-bold text-gray-800">
                    #{order.id}
                </div>
            </div>
            <button
                onClick={handleView}
                className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition"
                title="View Details"
            >
                <Eye size={18} />
            </button>
        </div>

        <div className="space-y-1 mt-2 text-sm border-t border-dashed pt-2">
            
            <div className="flex justify-between items-center">
                <span className="flex items-center gap-1 text-gray-500"><User size={14} /> Customer:</span>
                <span className="font-semibold text-gray-800 truncate max-w-[60%]">{order.name}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="flex items-center gap-1 text-gray-500"><Package size={14} /> Product:</span>
                <span className="font-medium text-gray-800 truncate max-w-[60%] text-right">{order.product}</span>
            </div>
            
            <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-lg text-gray-700">TOTAL:</span>
                <span className="font-bold text-xl text-green-700">৳ {order.total.toFixed(2)}</span>
            </div>
            <div className="text-right mt-1">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-${status.bg} text-${status.color}-800`}>
                    {status.label}
                </span>
            </div>
        </div>
    </div>
);


// Custom Confirmation Modal Component
const ConfirmationModal = ({ title, message, action, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300" onClick={onCancel}>
        <div 
            className="bg-white p-6 rounded-2xl w-80 max-w-sm shadow-2xl transform scale-100 transition-transform duration-300 border-t-4 border-red-500"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex justify-center mb-4 text-red-500">
                <AlertTriangle size={40} />
            </div>
            <h3 className="text-xl font-bold text-center mb-2 text-gray-800">{title}</h3>
            <p className="text-gray-600 text-center text-sm mb-6">{message}</p>
            <div className="flex gap-3">
                <button
                    className={`flex-1 ${action === 'delete_permanent' || action === 'bulk_delete_permanent' ? 'bg-red-700' : 'bg-red-500'} hover:bg-red-800 text-white py-2 rounded-xl font-semibold transition shadow-md`}
                    onClick={onConfirm}
                >
                    {action.includes('delete_permanent') ? 'Delete Permanently' : 'Confirm Action'}
                </button>
                <button
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-xl font-semibold transition shadow-sm"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
);

// Order Details Modal Component (Minimized and Cleaned)
const OrderDetailsModal = ({ order, isEditing, setEditMode, close, handleSave, handleStatusChange, setShowConfirmDelete }) => {
    const statusInfo = ALL_STATUSES.find(s => s.key === order.status) || ALL_STATUSES[0];
    const productDetails = PRODUCTS.find(p => p.name === order.product) || PRODUCTS[0];
    
    const [localEditData, setLocalEditData] = useState({ ...order });
    
    const handleStatusDropdownChange = (e) => {
        handleStatusChange(e.target.value);
    };
    
    const handleLocalEditChange = (e) => {
        setLocalEditData({ ...localEditData, [e.target.name]: e.target.value });
    };
    
    const handleLocalSave = () => {
        handleSave(localEditData);
        setEditMode(false);
    };
    
    let actionButton;
    if (isEditing) {
         actionButton = (
            <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-bold transition rounded-b-2xl"
                onClick={handleLocalSave}
            >
                <CheckCircle size={20} className="inline mr-2" /> Save Changes
            </button>
        );
    } else if (order.status === 'trash') {
        actionButton = (
            <button
                className="w-full bg-red-800 hover:bg-red-900 text-white py-3 font-bold transition rounded-b-2xl"
                onClick={() => setShowConfirmDelete({ action: 'delete_permanent', title: `Delete Order #${order.id} Permanently?`, message: "This order will be removed from the system forever. This action cannot be undone." })}
            >
                <X size={20} className="inline mr-2" /> Delete Permanently
            </button>
        );
    } else {
        actionButton = (
            <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-bold transition rounded-b-2xl"
                onClick={() => setEditMode(true)}
            >
                <Edit2 size={20} className="inline mr-2" /> Edit Order
            </button>
        );
    }


    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center transition-opacity z-40 p-4 sm:p-0" onClick={close}>
            <div 
                className="bg-white w-full max-w-sm h-[95vh] sm:h-auto sm:max-h-[90vh] mt-2 sm:mt-10 rounded-2xl shadow-xl transform scale-100 transition-transform duration-300 flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-2xl font-bold text-gray-800">Order #{order.id}</h2>
                    
                    <div className="flex items-center gap-2">
                        {/* Status Dropdown */}
                        <select
                            value={order.status}
                            onChange={handleStatusDropdownChange}
                            className={`
                                py-1.5 px-3 rounded-xl text-sm font-bold capitalize border-2
                                bg-white shadow-sm border-${statusInfo.color}-300 
                                text-${statusInfo.color}-800 appearance-none focus:outline-none focus:ring-1 focus:ring-${statusInfo.color}-500
                            `}
                        >
                            {ALL_STATUSES.filter(s => s.key !== 'trash').map(s => (
                                <option key={s.key} value={s.key} className={`bg-white text-gray-800`}>{s.label}</option>
                            ))}
                        </select>

                        <button onClick={close} className="text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition">
                            <X size={24} />
                        </button>
                    </div>
                </div>
                
                {/* Body Content */}
                <div className="p-5 flex-1 overflow-y-auto">
                    
                    {/* Billing Details (Name, Address, Phone) */}
                    <div className="p-4 bg-blue-50/50 rounded-xl mb-6 shadow-inner border border-blue-100">
                        <h3 className="text-base font-bold text-blue-700 mb-3 border-b border-blue-200 pb-2 flex items-center gap-2">
                            <User size={18} /> Customer Info
                        </h3>
                        
                        {isEditing ? (
                            <div className="space-y-2">
                                <input type="text" name="name" value={localEditData.name} onChange={handleLocalEditChange} className="w-full p-2 border border-gray-300 rounded-lg text-sm" placeholder="Customer Name"/>
                                <textarea name="address" value={localEditData.address} onChange={handleLocalEditChange} rows="2" className="w-full p-2 border border-gray-300 rounded-lg text-sm" placeholder="Address"/>
                                <input type="tel" name="phone" value={localEditData.phone} onChange={handleLocalEditChange} className="w-full p-2 border border-gray-300 rounded-lg text-sm" placeholder="Phone Number"/>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <p className="font-extrabold text-lg text-gray-900">{order.name}</p>
                                <p className="text-gray-600 leading-snug text-sm flex items-start gap-1"><MapPin size={16} className="text-gray-400 mt-1"/> {order.address}</p>
                                <a href={`tel:${order.phone}`} className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1">
                                    <Phone size={14} className="text-blue-400"/> {order.phone}
                                </a>
                                <p className="text-xs text-gray-500 pt-2"><strong className="text-gray-600">Payment:</strong> {order.payment}</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Product & Summary Table */}
                    <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-lg">
                        <h3 className="text-base font-bold text-green-700 mb-3 border-b border-gray-200 pb-2 flex items-center gap-2">
                            <Package size={18} /> Order Summary
                        </h3>
                        
                        <div className="space-y-3">
                            <div className="flex justify-between border-b pb-2 text-sm font-semibold text-gray-700">
                                <span>Product</span>
                                <span>Amount</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-800">{order.product} (x{order.quantity})</span>
                                <span className="text-gray-900 font-medium">৳ {(productDetails.price * order.quantity).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600 border-t border-dashed pt-2">
                                <span>Shipping:</span>
                                <span>৳ {order.shipping.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-green-700 pt-3 border-t-2 border-green-200">
                                <span>GRAND TOTAL:</span>
                                <span>৳ {order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer: Edit/Save Button */}
                <div className="p-0 border-t border-gray-200">
                    {actionButton}
                </div>

            </div>
        </div>
    );
};

// Add Order Modal Component
const AddOrderModal = ({ setIsAddingNew, setOrders, orders, PRODUCTS, SHIPPING_OPTIONS, setActiveTab, setCurrentPage }) => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        product: PRODUCTS[0].name,
        shippingKey: SHIPPING_OPTIONS[0].key,
    });

    const selectedProduct = PRODUCTS.find(p => p.name === formData.product) || PRODUCTS[0];
    const selectedShipping = SHIPPING_OPTIONS.find(s => s.key === formData.shippingKey) || SHIPPING_OPTIONS[0];

    const subtotal = selectedProduct.price;
    const shippingCost = selectedShipping.cost;
    const total = subtotal + shippingCost;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.address || !formData.phone) {
            console.error("Please fill out all required fields.");
            return;
        }

        const newOrder = {
            id: Math.max(...orders.map(o => o.id)) + 1, // Simple ID generation
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            product: formData.product,
            shipping: shippingCost,
            total: total,
            status: 'processing', // Default status for new orders
            quantity: 1, // Default quantity for new orders
            payment: 'Cash on delivery'
        };

        setOrders([...orders, newOrder]);
        setIsAddingNew(false);
        setActiveTab('processing'); 
        setCurrentPage(1); 
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 p-4" onClick={() => setIsAddingNew(false)}>
            <div 
                className="bg-white p-6 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl transform scale-100 transition-transform duration-300 border-t-4 border-green-500"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-6 border-b pb-3">
                    <h2 className="text-2xl font-extrabold text-green-700 flex items-center gap-2">
                        <ShoppingBag size={28} /> নতুন অর্ডার তৈরি করুন
                    </h2>
                    <button onClick={() => setIsAddingNew(false)} className="text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: BILLING & SHIPPING (2/3 width) */}
                    <div className="space-y-4 md:col-span-2">
                        <h3 className="text-xl font-bold text-green-700 border-b pb-2">Customer Details & Products</h3>

                        {/* PRODUCT SELECTION (Card Layout) */}
                        <div className="grid sm:grid-cols-2 gap-3">
                            {PRODUCTS.slice(0, 2).map(product => (
                                <label key={product.name} className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition 
                                    ${formData.product === product.name ? 'border-green-500 bg-green-50/50 shadow-md' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                                    <div className='flex justify-between items-center mb-1'>
                                        <span className="font-bold text-lg text-gray-800">{product.name}</span>
                                        <input
                                            type="radio"
                                            name="product"
                                            value={product.name}
                                            checked={formData.product === product.name}
                                            onChange={handleChange}
                                            className="form-radio text-green-600 h-5 w-5"
                                        />
                                    </div>
                                    <span className="font-extrabold text-green-600">৳ {product.price.toFixed(2)}</span>
                                </label>
                            ))}
                        </div>

                        {/* INPUT FIELDS (Refined look) */}
                        <label className="block">
                            <span className="text-sm font-bold text-gray-700">আপনার নাম *</span>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="এখানে আপনার নাম লিখুন"
                                className="w-full p-3 border border-gray-300 rounded-xl mt-1 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition shadow-inner"
                                required
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm font-bold text-gray-700">আপনার পূর্ণ ঠিকানা *</span>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="3"
                                placeholder="যেমন: বিভাগ, জেলা, থানা, গ্রাম/মহল্লা"
                                className="w-full p-3 border border-gray-300 rounded-xl mt-1 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition shadow-inner"
                                required
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm font-bold text-gray-700">আপনার মোবাইল নাম্বার *</span>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="১১ ডিজিটের মোবাইল নাম্বার দিন"
                                className="w-full p-3 border border-gray-300 rounded-xl mt-1 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition shadow-inner"
                                required
                            />
                        </label>
                        
                        {/* SHIPPING */}
                        <div className="pt-2">
                            <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2"><Truck size={18} /> Shipping Options</h4>
                            <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                                {SHIPPING_OPTIONS.map(option => (
                                    <label key={option.key} className="flex items-center">
                                        <input
                                            type="radio"
                                            name="shippingKey"
                                            value={option.key}
                                            checked={formData.shippingKey === option.key}
                                            onChange={handleChange}
                                            className="form-radio text-blue-600 h-5 w-5"
                                        />
                                        <span className="ml-3 text-gray-700 font-medium">{option.label}: <span className="font-extrabold text-gray-900">৳ {option.cost.toFixed(2)}</span></span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: ORDER SUMMARY & PAYMENT (1/3 width) */}
                    <div className="space-y-6 md:col-span-1">
                        
                        {/* ORDER SUMMARY */}
                        <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-xl">
                            <h3 className="text-xl font-bold text-blue-600 mb-4 border-b pb-2">Order Summary</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between font-semibold text-sm text-gray-700">
                                    <span>Subtotal</span>
                                    <span>৳ {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Shipping:</span>
                                    <span>+ ৳ {shippingCost.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-2xl font-extrabold text-green-700 pt-3 border-t-2 border-green-200">
                                    <span>Total:</span>
                                    <span>৳ {total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* CASH ON DELIVERY */}
                        <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-xl">
                            <h4 className="font-bold text-lg text-yellow-800 mb-2">Cash on delivery</h4>
                            <p className="text-sm text-yellow-700">অগ্রিম কোনো টাকা দিতে হবে না, পণ্য হাতে পেয়ে ডেলিভারি ম্যান কে পেমেন্ট করতে পারবেন।</p>
                        </div>

                        {/* PLACE ORDER BUTTON (Cleaner look) */}
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl text-xl font-extrabold transition shadow-lg shadow-green-400/50"
                        >
                            <ShoppingBag size={24} /> Place Order
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- MAIN APP COMPONENT ---
const OrderTabs = () => { 
    // Initial sample data
    const initialOrders = useMemo(() => Array.from({ length: 35 }, (_, i) => {
        const productOptions = [
            { name: "Prime Test", price: 990.00 }, 
            { name: "১ টি গ্লুটাথায়ন ক্রীম", price: 650.00 }
        ];
        const productIndex = i % 2;
        const shippingCost = (i % 3 === 0) ? 100.00 : 60.00;
        const basePrice = productOptions[productIndex].price;
        const randomStatusKey = ALL_STATUSES[i % 8].key;
        return { 
            id: 2950 - i, 
            name: (i === 1) ? 'Norottam' : `Customer ${2950 - i}`, 
            phone: (i === 1) ? '01679199106' : `01711xxx${99 - i}`, 
            status: (i === 1) ? 'canceled' : randomStatusKey, 
            address: (i === 1) ? 'Motlob.cadpur.fhoraji.kandy' : `${randomStatusKey} Address, City ${i % 5}`, 
            total: basePrice + shippingCost, 
            shipping: shippingCost, 
            product: productOptions[productIndex].name,
            quantity: 1,
            payment: 'Cash on delivery'
        };
    }), []);

    // State for orders, UI controls, and data manipulation
    const [orders, setOrders] = useState(initialOrders);
    const [editData, setEditData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState("processing");
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrderIds, setSelectedOrderIds] = useState([]);


    // --- COMPUTED DATA ---

    // 1. Calculate status counts
    const statusCounts = useMemo(() => orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        acc.all = (acc.all || 0) + 1;
        acc.completed = acc.completed || 0; // Initialize completed count
        acc.processing = acc.processing || 0; // Initialize processing count
        return acc;
    }, { all: 0 }), [orders]);
    
    // 2. Filter orders based on tab and search term
    const allFilteredOrders = useMemo(() => {
        let list = orders.filter(o => activeTab === 'all' || o.status === activeTab);
        
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            list = list.filter(o => 
                o.name.toLowerCase().includes(lowerCaseSearch) ||
                o.phone.includes(lowerCaseSearch) ||
                o.id.toString().includes(lowerCaseSearch)
            );
        }
        return list;
    }, [orders, activeTab, searchTerm]);

    // 3. Paginate the filtered list
    const totalPages = Math.ceil(allFilteredOrders.length / ITEMS_PER_PAGE);
    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return allFilteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [allFilteredOrders, currentPage]);


    // --- UTILITIES ---

    const getStatusInfo = (statusKey) => {
        return ALL_STATUSES.find(s => s.key === statusKey) || { label: 'Unknown', color: 'gray-700', bg: 'gray-300' };
    };

    const closeOrderModal = () => {
        setSelectedOrder(null);
        setEditData(null);
        setIsEditing(false);
        setShowConfirmDelete(false);
    };


    // --- PAGINATION HANDLERS ---
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    
    // --- CHECKBOX SELECTION HANDLERS ---
    const handleSelectAll = (isChecked) => {
        if (isChecked) {
            setSelectedOrderIds(paginatedOrders.map(o => o.id));
        } else {
            setSelectedOrderIds([]);
        }
    };

    const handleSelectOne = (id, isChecked) => {
        if (isChecked) {
            setSelectedOrderIds(prev => [...prev, id]);
        } else {
            setSelectedOrderIds(prev => prev.filter(orderId => orderId !== id));
        }
    };
    
    // --- ORDER ACTION HANDLERS ---

    const handleEditSave = (data) => {
        setOrders(orders.map((o) => o.id === data.id ? data : o));
        setSelectedOrder(data); 
        setIsEditing(false);
        closeOrderModal();
    };
    
    // Function to handle status change from within the Order Details Modal
    const handleStatusChangeFromModal = (newStatus) => {
        if (selectedOrder) {
            setOrders(orders.map(o => 
                o.id === selectedOrder.id ? { ...o, status: newStatus } : o
            ));
            // Update the selected order data in state to reflect the change
            setSelectedOrder(prev => ({ ...prev, status: newStatus }));
            // Also update editData if it's open
            setEditData(prev => prev ? ({ ...prev, status: newStatus }) : null);
        }
    };

    const handleBulkAction = (action) => {
        if (selectedOrderIds.length === 0) return;
        
        const newOrders = orders.map(o => {
            if (selectedOrderIds.includes(o.id)) {
                if (action === 'delete_permanent') {
                    return null; // Mark for permanent deletion
                }
                if (action === 'restore') {
                    // Restore from trash back to processing
                    return { ...o, status: 'processing' }; 
                }
                // Standard bulk status change
                return { ...o, status: action };
            }
            return o;
        }).filter(o => o !== null); // Filter out permanently deleted orders
        
        setOrders(newOrders);
        setSelectedOrderIds([]);
    };


    // --- MAIN RENDER ---
    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans"> 
            <div className="max-w-7xl mx-auto">
                {/* Header and Add Button */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-800">Order Dashboard</h1>
                    <button 
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 px-5 rounded-xl shadow-lg shadow-green-400/50 transition font-bold text-base"
                        onClick={() => setIsAddingNew(true)}
                    >
                        <PlusCircle size={20} /> New Order
                    </button>
                </div>

                {/* ---------- METRIC CARDS ---------- */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <MetricCard 
                        title="Total Orders" 
                        count={statusCounts.all} 
                        color="blue" 
                        icon={ShoppingBag} 
                    />
                    <MetricCard 
                        title="Processing Orders" 
                        count={statusCounts.processing || 0} 
                        color="yellow" 
                        icon={Clock} 
                    />
                    <MetricCard 
                        title="Completed Orders" 
                        count={statusCounts.completed || 0} 
                        color="green" 
                        icon={CheckCircle} 
                    />
                </div>
                
                {/* ---------- TABS ---------- */}
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 border-b border-gray-200 pb-3">
                    {[{ key: 'all', label: 'All', color: 'blue-600', bg: 'blue-50' }, ...ALL_STATUSES].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => { setActiveTab(tab.key); setCurrentPage(1); setSelectedOrderIds([]); }}
                            className={`
                                px-4 py-2 rounded-xl text-sm font-bold transition duration-300
                                ${activeTab === tab.key
                                    ? `bg-blue-600 text-white shadow-md hover:bg-blue-700`
                                    : `bg-white text-gray-700 hover:bg-gray-100 border border-gray-200`
                                }
                            `}
                        >
                            <span className="capitalize">{tab.label}</span>
                            <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full ${activeTab === tab.key ? `bg-white/30` : 'bg-gray-300 text-gray-700'}`}>
                                {statusCounts[tab.key] || 0}
                            </span>
                        </button>
                    ))}
                </div>

                {/* ---------- SEARCH AND BULK ACTIONS ---------- */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search by ID, Name, or Phone..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-sm"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    </div>

                    <div className="flex gap-2">
                        {/* Conditional Bulk Actions for TRASH tab */}
                        {selectedOrderIds.length > 0 && activeTab === 'trash' ? (
                            <>
                                <button
                                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl transition font-semibold text-sm shadow-md"
                                    onClick={() => handleBulkAction('restore')} 
                                    title="Restore Selected Orders"
                                >
                                    <RotateCcw size={18} /> Restore ({selectedOrderIds.length})
                                </button>
                                <button
                                    className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white py-3 px-4 rounded-xl transition font-semibold text-sm shadow-md"
                                    onClick={() => setShowConfirmDelete({ action: 'bulk_delete_permanent', title: `Permanently Delete ${selectedOrderIds.length} Orders?`, message: "This action cannot be undone. All selected orders will be removed permanently." })}
                                    title="Permanently Delete Selected Orders"
                                >
                                    <Trash2 size={18} /> Delete Perm. ({selectedOrderIds.length})
                                </button>
                            </>
                        ) : selectedOrderIds.length > 0 && (
                            // Standard Bulk Action for other tabs
                            <select 
                                onChange={(e) => handleBulkAction(e.target.value)} 
                                value="" 
                                className="p-3 border border-gray-300 rounded-xl shadow-sm bg-white font-bold text-gray-700 appearance-none pr-8 transition text-sm"
                            >
                                <option value="" disabled>Bulk Action ({selectedOrderIds.length})</option>
                                {ALL_STATUSES.filter(s => s.key !== activeTab).map(s => (
                                    <option key={s.key} value={s.key} className="capitalize">
                                        Move to {s.label}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>


                {/* ---------- ORDER LIST (RESPONSIVE LAYOUT: TABLE on MD+, CARDS on MOBILE) ---------- */}
                
                <div className="overflow-x-auto md:overflow-visible bg-white rounded-2xl shadow-xl">
                    {/* DESKTOP TABLE VIEW (md and up) */}
                    <div className="hidden md:block">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12 rounded-tl-2xl">
                                        <input
                                            type="checkbox"
                                            checked={paginatedOrders.length > 0 && selectedOrderIds.length === paginatedOrders.length}
                                            onChange={(e) => handleSelectAll(e.target.checked)}
                                            className="rounded-md text-blue-600 h-4 w-4 border-gray-300 focus:ring-blue-500"
                                            title="Select All"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="relative px-6 py-3 rounded-tr-2xl">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedOrders.length === 0 ? (
                                    <tr><td colSpan="7" className="py-10 text-center text-gray-500">No orders found in this category.</td></tr>
                                ) : (
                                    paginatedOrders.map((o) => {
                                        const status = getStatusInfo(o.status);
                                        const isSelected = selectedOrderIds.includes(o.id);
                                        return (
                                            <tr key={o.id} className={`hover:bg-blue-50/50 transition duration-150 ${isSelected ? 'bg-blue-50' : ''}`}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={(e) => handleSelectOne(o.id, e.target.checked)}
                                                        className="rounded-md text-blue-600 h-4 w-4 border-gray-300 focus:ring-blue-500"
                                                        title="Select Order"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    <span className="font-extrabold text-base text-blue-700">#{o.id}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {o.name} <br/> <span className="text-xs text-gray-400">{o.phone}</span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{o.product}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-${status.bg} text-${status.color}-800`}>
                                                        {status.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-green-700">
                                                    ৳ {o.total.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => {setSelectedOrder(o); setEditData({ ...o }); setIsEditing(false);}}
                                                        className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100 transition"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* MOBILE CARD VIEW (hidden on md and up) */}
                    <div className="md:hidden space-y-3 p-4">
                        {paginatedOrders.length === 0 ? (
                            <div className="py-10 text-center text-gray-500">No orders found in this category.</div>
                        ) : (
                            paginatedOrders.map((o) => (
                                <OrderCard 
                                    key={o.id} 
                                    order={o} 
                                    status={getStatusInfo(o.status)} 
                                    handleView={() => {setSelectedOrder(o); setEditData({ ...o }); setIsEditing(false);}} 
                                    isSelected={selectedOrderIds.includes(o.id)}
                                    onToggleSelect={handleSelectOne}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* ---------- PAGINATION ---------- */}
                <div className="flex justify-between items-center mt-6 p-4 bg-white border border-gray-200 rounded-2xl shadow-md">
                    <div className="text-sm text-gray-600">
                        Showing {paginatedOrders.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} to {Math.min(currentPage * ITEMS_PER_PAGE, allFilteredOrders.length)} of {allFilteredOrders.length} results
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => goToPage(1)}
                            disabled={currentPage === 1}
                            className="p-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 disabled:opacity-50 transition"
                            title="First Page"
                        >
                            <ChevronsLeft size={16} />
                        </button>
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 disabled:opacity-50 transition"
                            title="Previous Page"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        
                        <span className="px-3 py-1 font-bold bg-blue-600 text-white rounded-lg shadow-inner">
                            {currentPage} / {totalPages}
                        </span>

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="p-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 disabled:opacity-50 transition"
                            title="Next Page"
                        >
                            <ChevronRight size={16} />
                        </button>
                        <button
                            onClick={() => goToPage(totalPages)}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="p-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 disabled:opacity-50 transition"
                            title="Last Page"
                        >
                            <ChevronsRight size={16} />
                        </button>
                    </div>
                </div>

            </div>

            {/* --- MODAL RENDERS --- */}
            {isAddingNew && <AddOrderModal 
                setIsAddingNew={setIsAddingNew}
                setOrders={setOrders}
                orders={orders}
                PRODUCTS={PRODUCTS}
                SHIPPING_OPTIONS={SHIPPING_OPTIONS}
                setActiveTab={setActiveTab}
                setCurrentPage={setCurrentPage}
            />}
            
            {showConfirmDelete && (
                <ConfirmationModal 
                    title={showConfirmDelete.title}
                    message={showConfirmDelete.message}
                    action={showConfirmDelete.action}
                    onConfirm={() => {
                        if (showConfirmDelete.action === 'delete_permanent' && selectedOrder) {
                            // This handles single permanent delete from modal
                            setOrders(orders.filter(o => o.id !== selectedOrder.id));
                        } else if (showConfirmDelete.action === 'bulk_delete_permanent') {
                            handleBulkAction('delete_permanent');
                        }
                        setShowConfirmDelete(false);
                        closeOrderModal();
                    }}
                    onCancel={() => setShowConfirmDelete(false)}
                />
            )}


            {/* ---------- ORDER DETAIL/EDIT MODAL ---------- */}
            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    isEditing={isEditing}
                    setEditMode={setIsEditing}
                    close={closeOrderModal}
                    handleSave={(data) => handleEditSave(data)}
                    handleStatusChange={handleStatusChangeFromModal}
                    setShowConfirmDelete={setShowConfirmDelete}
                />
            )}
        </div>
    );
}

export default OrderTabs;