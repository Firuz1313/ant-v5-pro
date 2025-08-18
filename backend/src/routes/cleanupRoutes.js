import express from "express";
import { cleanupTVInterfaces } from "../controllers/cleanupController.js";

const router = express.Router();

// POST /api/cleanup/tv-interfaces - Очистить и создать пользовательские TV интерфейсы
router.post("/tv-interfaces", cleanupTVInterfaces);

export default router;
