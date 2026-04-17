import React, { useEffect, useState, useMemo, useCallback } from "react";
import { format, render } from "timeago.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

function formatTime(date) {
  return dayjs(date).fromNow(); // "2 hours ago"
}


import { 
    Search, RotateCcw, ArrowUp, ArrowDown, Eye, X, Edit2, Save,
    CheckCircle, Clock, Truck, XCircle, Info, DollarSign, List,
    ChevronLeft, ChevronRight, AlertTriangle, Package, Ban, User,
    Plus, Hash, Calendar // Added new icons
} from 'lucide-react';

// --- CONFIGURATION ---
// API endpoint.
const API_ORDERS_URL = "http://localhost:5000/api/orders";

const ITEMS_PER_PAGE = 10;

// Status configuration (used for badges, filtering, and the editing dropdown)
const allStatuses = {
    processing: { label: "Processing", color: "yellow-600", bg: "yellow-100", icon: Clock },
    onhold: { label: "On Hold", color: "orange-600", bg: "orange-100", icon: Info },
    completed: { label: "Completed", color: "green-600", bg: "green-100", icon: CheckCircle },
    canceled: { label: "Canceled", color: "red-600", bg: "red-100", icon: XCircle },
    refunded: { label: "Refunded", color: "gray-600", bg: "gray-100", icon: XCircle },
    failed: { label: "Failed", color: "red-600", bg: "red-100", icon: AlertTriangle },
    cf_accepted: { label: "CF Accepted", color: "blue-600", bg: "blue-100", icon: CheckCircle },
    trash: { label: "Trash", color: "gray-500", bg: "gray-200", icon: Ban },
};


// --- Helper Components ---

/**
 * StatusBadge component for consistent styling
 */
const StatusBadge = ({ statusKey }) => {
    // Normalize key to lowercase
    const normalizedKey = (statusKey || 'processing').toLowerCase();
    const status = allStatuses[normalizedKey] || { label: statusKey, color: "gray-600", bg: "gray-100", icon: List };
    const Icon = status.icon;

    return (
        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full shadow-sm text-${status.color} bg-${status.bg} transition duration-150`}>
            <Icon className="w-3 h-3 mr-1" />
            {status.label}
        </span>
    );
};

/**
 * Custom hook for managing sorting state
 */
const useSortableData = (items, config = { key: 'date', direction: 'descending' }) => {
    const [sortConfig, setSortConfig] = useState(config);

    const sortedItems = useMemo(() => {
        if (!items) return [];
        let sortableItems = [...items];

        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [items, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === 'ascending'
        ) {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return { items: sortedItems, requestSort, sortConfig };
};

/**
 * Modal for viewing/editing order details and status
 */
const OrderDetailsModal = ({ order, close, handleSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    // State to hold temporary edits, initializing with the full order object
    const [tempData, setTempData] = useState(order);

    // Destructure order details safely
    const displayId = order._id || order.id || 'N/A';
    const displayDate = order.date ? new Date(order.date).toLocaleDateString() : 'N/A';
    
    // Calculate display total from temp data if editing, otherwise from prop
    const currentData = isEditing ? tempData : order;
    const displayTotal = (currentData.total || 0).toFixed(2);
    const displayShipping = (currentData.shipping || 0).toFixed(2);
    const subtotal = (currentData.total || 0) - (currentData.shipping || 0);

    // Handle changes to form inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTempData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = () => {
        // Pass the entire updated data object back
        handleSave(tempData);
        setIsEditing(false);
    };

    useEffect(() => {
        // Reset temp data when a new order is loaded or editing is cancelled
        setTempData(order);
        setIsEditing(false);
    }, [order]);


    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transition-all transform duration-300">
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Order' : 'Order Details'} - #{displayId}</h2>
                    <button onClick={close} className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-5 space-y-4 text-sm max-h-[60vh] overflow-y-auto">
                    
                    {/* Customer Info */}
                    <div className={`p-3 rounded-lg border transition-colors ${isEditing ? 'bg-blue-50' : 'bg-gray-50'}`}>
                        <h3 className="font-bold text-gray-700 mb-2 flex items-center"><User className="w-4 h-4 mr-2"/>Customer & Contact</h3>
                        <div className="space-y-2">
                            {isEditing ? (
                                <>
                                    <div className="grid grid-cols-3 items-center gap-2">
                                        <span className="font-medium text-gray-500">Name:</span>
                                        <input 
                                            type="text"
                                            name="name"
                                            value={tempData.name}
                                            onChange={handleChange}
                                            className="col-span-2 w-full p-1 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-sm"
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-2">
                                        <span className="font-medium text-gray-500">Phone:</span>
                                        <input 
                                            type="text"
                                            name="phone"
                                            value={tempData.phone}
                                            onChange={handleChange}
                                            className="col-span-2 w-full p-1 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-sm"
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-2">
                                        <span className="font-medium text-gray-500">Address:</span>
                                        <input 
                                            type="text"
                                            name="address"
                                            value={tempData.address}
                                            onChange={handleChange}
                                            className="col-span-2 w-full p-1 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-sm"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-500">Name:</span>
                                        <span className="font-semibold text-gray-800">{order.name || 'Unknown Customer'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-500">Phone:</span>
                                        <span className="font-semibold text-gray-800">{order.phone || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-500">Address:</span>
                                        <span className="font-semibold text-right max-w-xs text-gray-800">{order.address || 'N/A'}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Order Details and Status Editing */}
                    <div className={`p-3 rounded-lg border transition-colors ${isEditing ? 'bg-blue-50' : 'bg-gray-50'}`}>
                        <h3 className="font-bold text-gray-700 mb-2 flex items-center"><Package className="w-4 h-4 mr-2"/>Order Status & Items</h3>
                        
                        {/* Product Image Placeholder */}
                        <div className="my-3">
                            <img 
                                src={`https://placehold.co/600x400/EBEAFB/624BDE?text=Product: ${order.product || 'Image'}`} 
                                alt="Product" 
                                className="rounded-lg w-full h-auto object-cover"
                                onError={(e) => e.target.src = 'https://placehold.co/600x400/EBEAFB/624BDE?text=Product+Image'}
                            />
                        </div>

                        <div className="space-y-2">
                            {isEditing ? (
                                <div className="grid grid-cols-3 items-center gap-2">
                                    <span className="font-medium text-gray-500">Product:</span>
                                    <input 
                                        type="text"
                                        name="product"
                                        value={tempData.product}
                                        onChange={handleChange}
                                        className="col-span-2 w-full p-1 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-sm"
                                    />
                                </div>
                            ) : (
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-500">Product:</span>
                                    <span className="font-semibold text-gray-800">{order.product || 'N/A'}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-500">Order Date:</span>
                                <span className="font-semibold text-gray-800">{displayDate}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="font-medium text-gray-500">Status:</span>
                                {isEditing ? (
                                    <select
                                        name="status"
                                        value={tempData.status}
                                        onChange={handleChange}
                                        className="py-1 px-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-sm"
                                    >
                                        {Object.keys(allStatuses).map(key => (
                                            <option key={key} value={key}>{allStatuses[key].label}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <StatusBadge statusKey={order.status || 'N/A'} />
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Financial Summary */}
                    <div className={`p-3 rounded-lg border transition-colors ${isEditing ? 'bg-blue-50' : 'bg-gray-50'}`}>
                        <h3 className="font-bold text-gray-700 mb-2 flex items-center"><DollarSign className="w-4 h-4 mr-2"/>Financial Summary</h3>
                        <div className="space-y-1">
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-500">Subtotal:</span>
                                <span className="font-semibold text-gray-800">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-500">Shipping:</span>
                                <span className="font-semibold text-gray-800">${displayShipping}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-gray-200">
                                <span className="font-bold text-lg text-gray-700">TOTAL:</span>
                                <span className="font-bold text-purple-600 text-xl">${displayTotal}</span>
                            </div>
                        </div>
                    </div>
                    

                </div>
                <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
                    {isEditing ? (
                        <>
                            <button 
                                onClick={() => {
                                    setIsEditing(false);
                                    setTempData(order); // Reset changes
                                }} 
                                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-100 transition duration-150"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveChanges} 
                                className="flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition duration-150"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                onClick={() => setIsEditing(true)} 
                                className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-150"
                            >
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit
                            </button>
                            <button 
                                onClick={close} 
                                className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg shadow-md hover:bg-purple-700 transition duration-150"
                            >
                                Close
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

/**
 * NEW: Modal for adding a new order
 */
const AddOrderModal = ({ close, handleAdd }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        product: '',
        total: '',
        shipping: '',
        status: 'processing',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Basic Validation
        if (!formData.name || !formData.product || !formData.total) {
            setError('Name, Product, and Total are required.');
            return;
        }

        const total = parseFloat(formData.total);
        const shipping = parseFloat(formData.shipping) || 0;

        if (isNaN(total) || isNaN(shipping) || total <= 0) {
            setError('Total and Shipping must be valid numbers. Total must be greater than 0.');
            return;
        }

        setIsSaving(true);
        
        const newOrderData = {
            ...formData,
            total,
            shipping,
            date: new Date().toISOString(), // Add current date
        };

        try {
            // Wait for the handleAdd function (in the parent) to complete
            await handleAdd(newOrderData);
            // If it completes without throwing, we are done
            setIsSaving(false);
            // handleAdd should close the modal on success
        } catch (err) {
            // If handleAdd throws an error, catch it here
            setError(err.message || "Could not save order. Please try again.");
            setIsSaving(false); // Stop the spinner
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl w-full max-w-lg transition-all transform duration-300">
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Add New Order</h2>
                    <button type="button" onClick={close} className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-5 space-y-4 text-sm max-h-[60vh] overflow-y-auto">
                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Customer Name *</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Product *</label>
                        <input type="text" name="product" value={formData.product} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Total ($) *</label>
                            <input type="number" name="total" step="0.01" value={formData.total} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Shipping ($)</label>
                            <input type="number" name="shipping" step="0.01" value={formData.shipping} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:border-purple-500 focus:ring-purple-500">
                                {Object.keys(allStatuses).map(key => (
                                    <option key={key} value={key}>{allStatuses[key].label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {error && (
                        <div className="text-red-600 text-sm font-medium p-3 bg-red-100 rounded-lg flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            {error}
                        </div>
                    )}
                </div>
                
                <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
                    <button 
                        type="button"
                        onClick={close} 
                        className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-100 transition duration-150"
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        className="flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition duration-150 disabled:bg-green-400"
                        disabled={isSaving}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save Order'}
                    </button>
                </div>
            </form>
        </div>
    );
};


// --- Main Dashboard Component ---

export default function OrdersDashboard() {
    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false); // Set to false initially
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isAddingOrder, setIsAddingOrder] = useState(false); // State for new modal

    /**
     * Helper function to normalize order data for display/sorting
     */
   const normalizeOrders = useCallback((dataArray) => {
    return dataArray.map(order => ({
        ...order,
        id: order._id,      // ← ALWAYS use MongoDB ID
        _id: order._id,     // ← keep _id for backend update
        date: order.date || new Date().toISOString(),
        total: parseFloat(order.total) || 0,
        shipping: parseFloat(order.shipping) || 0,
        status: (order.status || 'processing').toLowerCase(),
    }));
}, []);


    /**
     * Fetches orders from the backend API.
     * RE-ENABLED live fetch
     */
    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setCurrentPage(1); 

        try {
            const res = await fetch(API_ORDERS_URL);
            
            if (!res.ok) {
                throw new Error(`Failed to fetch orders. HTTP status: ${res.status}`);
            }
            
            const data = await res.json();
            const ordersArray = Array.isArray(data) ? data : data.orders || [];
            
            setOrders(normalizeOrders(ordersArray));

        } catch (err) {
            console.error("Error fetching orders:", err);
            setError(`Could not connect to API at ${API_ORDERS_URL}. Ensure the backend server is running and accessible.`);
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    }, [normalizeOrders]);

    /**
     * Sends an updated order object to the backend and updates the local state.
     * IMPORTANT: This function ONLY saves the STATUS, as that is all the
     * provided backend router supports.
     */
    const updateOrder = useCallback(async (updatedOrder) => {
        const id = updatedOrder._id || updatedOrder.id;
        try {
            // Optimistic UI: update local state immediately
            // This will show the name/address changes locally, but they won't persist
            // after a refresh unless the backend is updated.
            setOrders(prev =>
                prev.map(o => (o._id === id ? updatedOrder : o))
            );
            setSelectedOrder(updatedOrder);

            // 🔥 BACKEND CALL: Only sending status, as per router.
            // Edits to name/address/product will NOT be saved.
            const res = await fetch(`${API_ORDERS_URL}/${id}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                // We ONLY send the status, as that's all the backend route accepts
                body: JSON.stringify({ status: updatedOrder.status }) 
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to update order");
            }
            
            // Re-fetch to get the "truth" from the server.
            // This will revert the optimistic name/address changes.
            fetchOrders(); 

        } catch (err) {
            console.error("Update failed:", err);
            setError("Update failed. Reverting changes."); // Show error to user
            fetchOrders(); // restore original data
        }
    }, [fetchOrders]);

    /**
     * NEW: Adds a new order to the backend and refreshes the list.
     * RE-ENABLED live fetch
     */
    const handleAddOrder = useCallback(async (newOrderData) => {
        // This function is now designed to throw an error on failure,
        // which will be caught by the modal's handleSubmit.
        try {
            const res = await fetch(API_ORDERS_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newOrderData)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to add new order");
            }

            // Success
            setIsAddingOrder(false); // Close the modal
            fetchOrders(); // Refresh the entire list
        
        } catch (err) {
            console.error("Failed to add order:", err);
            // Re-throw the error to be caught by the modal
            throw err;
        }
    }, [fetchOrders]);


    // Initial load
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Calculate Status Counts
    const statusCounts = useMemo(() => {
        return orders.reduce((acc, order) => {
            const status = order.status;
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});
    }, [orders]);


    // Apply filtering, searching, and sorting
    const { items: sortedOrders, requestSort, sortConfig } = useSortableData(orders);

    const processedOrders = useMemo(() => {
        const filtered = sortedOrders.filter(order => {
            const matchesFilter = filterStatus === "all" || order.status === filterStatus;
            
            // Search across multiple fields
            const searchTerms = searchQuery.toLowerCase();
            const matchesSearch =
                String(order.id).includes(searchTerms) ||
                (order.name || '').toLowerCase().includes(searchTerms) ||
                (order.phone || '').includes(searchTerms) ||
                (order.product || '').toLowerCase().includes(searchTerms) ||
                (order.status || '').toLowerCase().includes(searchTerms);
                
            return matchesFilter && matchesSearch;
        });

        return filtered;
    }, [sortedOrders, filterStatus, searchQuery]);

    // Apply pagination
    const totalPages = Math.ceil(processedOrders.length / ITEMS_PER_PAGE);
    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return processedOrders.slice(startIndex, endIndex);
    }, [processedOrders, currentPage]);
    
    // Pagination handlers
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Table Header Component (for sorting) - NOW WITH ICONS
    const SortableHeader = ({ label, sortKey, icon: Icon }) => {
        const isCurrentSort = sortConfig && sortConfig.key === sortKey;
        const direction = isCurrentSort ? sortConfig.direction : null;

        return (
            <th 
                className="p-2 sm:p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer transition duration-150 hover:bg-gray-200"
                onClick={() => requestSort(sortKey)}
            >
                <div className="flex items-center">
                    {Icon && <Icon className="w-4 h-4 mr-1 sm:mr-1.5 text-gray-400" />}
                    {label}
                    {isCurrentSort && (
                        direction === 'ascending' ? <ArrowUp className="ml-1 w-3 h-3 text-purple-600" /> : <ArrowDown className="ml-1 w-3 h-3 text-purple-600" />
                    )}
                </div>
            </th>
        );
    };

    // NEW: Mobile Order Card component
    const OrderCard = ({ order, onSelect }) => {
        return (
            <div className="bg-white rounded-xl shadow-lg mb-4 p-4 border border-gray-100 transition-all duration-300 hover:shadow-xl">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
                    <span className="font-semibold text-purple-700 text-sm">#{order.id}</span>
                    <span className="text-xs text-gray-500">{order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="mb-3">
                    <p className="font-bold text-gray-800 text-lg">{order.name || 'Unknown'}</p>
                    <p className="text-sm text-gray-600">{order.product || 'N/A'}</p>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-purple-700">${(order.total || 0).toFixed(2)}</span>
                    <div className="flex items-center gap-2">
                        <StatusBadge statusKey={order.status || 'processing'} />
                        <button 
                            onClick={() => onSelect(order)}
                            className="p-2 text-purple-600 hover:text-purple-800 rounded-full hover:bg-purple-100 transition"
                            title="View Details"
                        >
                            <Eye className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6 font-['Inter']">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Order Management Dashboard</h1>

            {/* Top Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                
                {/* Search Bar */}
                <div className="relative w-full md:w-1/2 lg:w-1/3">
                    <input
                        type="text"
                        placeholder="Search ID, Name, Product, or Phone..."
                        value={searchQuery}
                        onChange={e => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1); // Reset page on search
                        }}
                        className="w-full border border-gray-300 pl-10 pr-4 py-2 rounded-xl shadow-sm focus:border-purple-500 focus:ring-purple-500 transition"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>

                {/* Actions */}
                <div className="flex gap-3 w-full md:w-auto justify-end">
                    <button 
                        onClick={fetchOrders} 
                        className="flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl shadow-sm hover:bg-gray-100 transition duration-150 text-sm font-medium"
                        disabled={isLoading}
                    >
                        <RotateCcw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        {isLoading ? 'Loading...' : 'Refresh Data'}
                    </button>
                    <button 
                        onClick={() => setIsAddingOrder(true)}
                        className="flex items-center justify-center w-full md:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl shadow-md hover:from-purple-700 hover:to-indigo-700 transition duration-150 text-sm font-medium"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Order Now
                    </button>
                </div>
            </div>

            {/* Status Counters - NOW 2-COLUMN ON MOBILE */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                
                <div className="p-3 sm:p-4 bg-white rounded-xl shadow-lg border-l-4 border-orange-500 flex items-center justify-between transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                    <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500">On Hold</p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-800">{statusCounts['onhold'] || 0}</p>
                    </div>
                    <Info className="w-6 h-6 text-orange-500 opacity-70" />
                </div>

           

                <div className="p-3 sm:p-4 bg-white rounded-xl shadow-lg border-l-4 border-red-500 flex items-center justify-between transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                    <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500">Canceled</p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-800">{statusCounts['canceled'] || 0}</p>
                    </div>
                    <Ban className="w-6 h-6 text-red-500 opacity-70" />
                </div>

                <div className="p-3 sm:p-4 bg-white rounded-xl shadow-lg border-l-4 border-yellow-500 flex items-center justify-between transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                    <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500">Processing</p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-800">{statusCounts['processing'] || 0}</p>
                    </div>
                    <Clock className="w-6 h-6 text-yellow-500 opacity-70" />
                </div>

                <div className="p-3 sm:p-4 bg-white rounded-xl shadow-lg border-l-4 border-green-500 flex items-center justify-between transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                    <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500">Completed</p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-800">{statusCounts['completed'] || 0}</p>
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-500 opacity-70" />
                </div>

            </div>


            {/* Status Filters - SMALLER ON MOBILE */}
            <div className="flex flex-wrap gap-2 mb-6 p-3 sm:p-4 bg-white rounded-xl shadow-lg">
                <span className="font-semibold text-gray-700 mr-2 my-1 hidden md:block">Filter by Status:</span>
                {["all", ...Object.keys(allStatuses)].map(statusKey => {
                    const statusLabel = statusKey === "all" ? "All Orders" : allStatuses[statusKey].label;
                    return (
                        <button
                            key={statusKey}
                            onClick={() => {
                                setFilterStatus(statusKey);
                                setCurrentPage(1); // Reset page on filter change
                            }}
                            className={`px-3 py-1 text-xs sm:px-4 sm:py-1.5 sm:text-sm font-medium rounded-full transition duration-150 ${
                                filterStatus === statusKey 
                                    ? "bg-purple-600 text-white shadow-md" 
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            {statusLabel}
                        </button>
                    );
                })}
            </div>

            {/* --- NEW RESPONSIVE LIST/TABLE CONTAINER --- */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-3 sm:p-4 text-sm font-medium text-gray-500 border-b border-gray-100">
                    Showing {paginatedOrders.length} of {processedOrders.length} total results matching filters.
                </div>

                {/* --- DESKTOP TABLE VIEW --- */}
                <div className="overflow-x-auto hidden md:block">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <SortableHeader label="Order ID" sortKey="id" icon={Hash} />
                                <SortableHeader label="Date" sortKey="date" icon={Calendar} />
                                <SortableHeader label="Customer" sortKey="name" icon={User} />
                                <SortableHeader label="Product" sortKey="product" icon={Package} />
                                <SortableHeader label="Total" sortKey="total" icon={DollarSign} />
                                <SortableHeader label="Status" sortKey="status" icon={List} />
                                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {/* Loading State */}
                            {isLoading && (
                                <tr>
                                    <td colSpan="7" className="p-6 text-center text-gray-500">
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-5 h-5 border-2 border-purple-400 border-t-purple-800 rounded-full animate-spin"></div>
                                            <span>Fetching orders from API...</span>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {/* Error State */}
                            {error && (
                                <tr>
                                    <td colSpan="7" className="p-6 text-center text-red-700 bg-red-100 font-medium rounded-b-xl flex items-center justify-center space-x-2">
                                        <AlertTriangle className="w-5 h-5" />
                                        <span>{error}</span>
                                    </td>
                                </tr>
                            )}
                            
                            {/* No Data State */}
                            {!isLoading && !error && paginatedOrders.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="p-6 text-center text-gray-500">
                                        No orders match your current filter or search criteria.
                                    </td>
                                </tr>
                            )}

                            {/* Data Rows */}
                            {!isLoading && !error && paginatedOrders.map(order => (
                                <tr 
                                    key={order.id} 
                                    className="hover:bg-purple-100 transition duration-150 odd:bg-white even:bg-gray-50"
                                >
                                    <td className="p-2 sm:p-3 text-sm font-medium text-gray-900">#{order.id || 'N/A'}</td>

                                    <td>{formatTime(order.createdAt)}</td>

                                    <td className="p-2 sm:p-3 text-sm text-gray-700">{order.name || 'Unknown'}</td>
                                    <td className="p-2 sm:p-3 text-sm text-gray-700">{order.product || 'N/A'}</td>
                                    <td className="p-2 sm:p-3 text-sm font-bold text-purple-700">${(order.total || 0).toFixed(2)}</td>
                                    <td className="p-2 sm:p-3 text-sm">
                                        <StatusBadge statusKey={order.status || 'processing'} />
                                    </td>
                                    <td className="p-2 sm:p-3">
                                        <button 
                                            onClick={() => setSelectedOrder(order)} // Opens the modal with full order info
                                            className="p-2 text-purple-600 hover:text-purple-800 rounded-full hover:bg-purple-200 transition"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* --- MOBILE CARD VIEW --- */}
                <div className="block md:hidden p-4">
                    {/* Loading State */}
                    {isLoading && (
                        <div className="p-6 text-center text-gray-500">
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-5 h-5 border-2 border-purple-400 border-t-purple-800 rounded-full animate-spin"></div>
                                <span>Fetching orders from API...</span>
                            </div>
                        </div>
                    )}
                    {/* Error State */}
                    {error && (
                        <div className="p-6 text-center text-red-700 bg-red-100 font-medium rounded-lg flex items-center justify-center space-x-2">
                            <AlertTriangle className="w-5 h-5" />
                            <span>{error}</span>
                        </div>
                    )}
                    {/* No Data State */}
                    {!isLoading && !error && paginatedOrders.length === 0 && (
                        <div className="p-6 text-center text-gray-500">
                            No orders match your current filter or search criteria.
                        </div>
                    )}
                    {/* Data Cards */}
                    {!isLoading && !error && paginatedOrders.map(order => (
                        <OrderCard 
                            key={order.id} 
                            order={order} 
                            onSelect={setSelectedOrder} 
                        />
                    ))}
                </div>
            </div>


            {/* Pagination Controls - SMALLER ON MOBILE */}
            {totalPages > 1 && processedOrders.length > ITEMS_PER_PAGE && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 p-3 sm:p-4 bg-white rounded-xl shadow-lg gap-3">
                    <div className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        {/* Simple pagination buttons */}
                        {[...Array(totalPages)].map((_, index) => {
                            const pageNumber = index + 1;
                            // Only show a limited number of page buttons
                            const isVisible = pageNumber === 1 || pageNumber === totalPages || (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1);
                            const isEllipsis = (pageNumber === 2 && currentPage > 3) || (pageNumber === totalPages - 1 && currentPage < totalPages - 2);


                            if (isEllipsis) {
                                return (
                                     <span key={pageNumber} className="px-2 sm:px-3 py-2 text-sm text-gray-500 hidden sm:inline-block">...</span>
                                 );
                            }

                            if (isVisible) {
                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => goToPage(pageNumber)}
                                        className={`px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm font-medium rounded-full transition duration-150 ${
                                            currentPage === pageNumber 
                                                ? 'bg-purple-600 text-white shadow-md' 
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            }
                            return null;
                        })}
                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}


            {/* Order Detail Modal */}
            {selectedOrder && (
                <OrderDetailsModal 
                    order={selectedOrder} 
                    close={() => setSelectedOrder(null)} 
                    handleSave={updateOrder} // Pass the update function
                />
            )}

{/* ... existing code ... */}
            {/* NEW: Add Order Modal */}
            {isAddingOrder && (
                <AddOrderModal
                    close={() => setIsAddingOrder(false)}
                    handleAdd={handleAddOrder}
                />
            )}
        </div>
    );
}