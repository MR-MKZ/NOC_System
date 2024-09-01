import express from "express";
import { config } from "dotenv";
import cors from "cors";
import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";

import { v1AuthRoutes } from "./api/v1/auth.js";
import { v1WebhookRoutes } from "./api/v1/webhook.js";
import { v1NotificationRoutes } from "./api/v1/notifications.js";
import { v1UserRoutes } from "./api/v1/user.js";
import authenticateToken from "./middlewares/auth/authenticateToken.js";

config();

const app = express();
const port = Number(process.env.PORT) || 8000;
const serveIp = process.env.SERVE_IP || "127.0.0.1";

// Get the current module's filename
const __filename = fileURLToPath(import.meta.url);
// Get the current module's directory name
const __dirname = path.dirname(__filename);

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "./logs/log.log"),
  { flags: "a" }
);

app.use(cors());
app.use(express.json());
app.use(morgan("combined"));
app.use(morgan("combined", { stream: accessLogStream }));

// api v1 routes
app.use("/api/v1/auth", v1AuthRoutes);
app.use("/api/v1/webhook", authenticateToken, v1WebhookRoutes);
app.use("/api/v1/notifications", authenticateToken, v1NotificationRoutes);
app.use("/api/v1/user", authenticateToken, v1UserRoutes);

// return 404 to all unknown routes
app.all("*", function (req, res) {
  res.status(404).json({
    message: "Not found",
  });
});

app.listen(port, serveIp, () => {
  console.log(`Server is running on ${serveIp}:${port}`);
});