// server.js
import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import MongoStore from "connect-mongo";

import connectDB from "./config/db.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoute from "./routes/adminRoute.js";
import metaRoute from "./routes/metaRoute.js";
import statusRoutes from "./routes/statusRoutes.js";
import productRoutes from "./routes/productRoutes.js"; // if you add products
import shippingRoutes from "./routes/shippingRoutes.js";
// Load environment variables
dotenv.config();

const app = express();

// ----------------- Middleware -----------------
app.use(express.json()); // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse URL-encoded bodies

// ----------------- CORS -----------------
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL || "http://localhost:5174",
  `https://www.${process.env.FRONTEND_URL || "primehealthcare202.cloud"}`
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allow Postman/curl
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// ----------------- Trust Proxy -----------------
app.set("trust proxy", 1);

// ----------------- Session -----------------


// ----------------- Routes -----------------
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoute);
app.use("/api/meta", metaRoute);
app.use("/api/statuses", statusRoutes);
app.use("/api/products", productRoutes); // add products routes
app.use("/api/shipping", shippingRoutes);

// ----------------- Default Route -----------------
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// ----------------- 404 Handler -----------------
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ----------------- Global Error Handler -----------------
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack || err.message);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

// ----------------- Connect DB & Start Server -----------------
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  });
