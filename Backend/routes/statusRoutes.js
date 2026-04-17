import express from "express";
import { getStatuses } from "../controllers/statusController.js";

const router = express.Router();

// GET /api/statuses
router.get("/", getStatuses);

export default router;
