import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Orderconfirmation from "./Orderconfirmation"; // make sure component name matches
import { toast } from "react-toastify";

export default function OrderConfirmWrapper() {
  const { orderId } = useParams(); // MongoDB _id
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // 1️⃣ Check localStorage first
        const saved = localStorage.getItem(`order-${orderId}`);
        if (saved) {
          setOrder(JSON.parse(saved));
          setLoading(false);
          return;
        }
        
        // 2️⃣ Fetch from backend
        const res = await fetch(`http://localhost:5000/api/users/${orderId}`);
        if (!res.ok) throw new Error("Order not found");

        const data = await res.json();
        console.log("Fetched order:", data); // debug

        // handle response whether it's { order } or { user }
        setOrder(data.order || data.user || data);
      } catch (err) {
        console.error(err);
        toast.error("Order ID not found. Please try again.");
        setOrder(null);
      } finally {
        setLoading(false); // ✅ stop loading in all cases
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="text-center p-10">Loading order...</div>;
  if (!order) return <div className="text-center p-10">Order data not found.</div>;

  return <Orderconfirmation order={order} />;
}
