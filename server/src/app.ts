import express from "express";
import cors from "cors";
import weatherRoutes from "./routes/weatherRoutes";
import recordRoutes from "./routes/recordRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "WeatherWise API is running",
  });
});

app.use("/api/weather", weatherRoutes);
app.use("/api/records", recordRoutes);

app.use(errorHandler);

export default app;