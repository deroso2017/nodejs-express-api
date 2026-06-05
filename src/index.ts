import "dotenv/config";
import express, { Request, Response } from "express";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "success", data: { uptime: process.uptime() } }));
app.use("/api", routes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ status: "error", message: "Route not found" });
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
