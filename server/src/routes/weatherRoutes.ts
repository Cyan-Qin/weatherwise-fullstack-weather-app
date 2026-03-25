import { Router } from "express";
import { searchWeather } from "../controllers/weatherController";

const router = Router();

router.post("/search", searchWeather);

export default router;