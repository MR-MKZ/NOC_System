import express from "express";
import { config } from "dotenv";
import cors from "cors";
import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";

// Routes
import { v1AuthRoutes } from "./api/v1/auth.js";
import { v1WebhookRoutes } from "./api/v1/webhook.js";
import { v1PackRoutes } from "./api/v1/pack.js";
import { v1UserRoutes } from "./api/v1/user.js";
import { v1TeamRoutes } from "./api/v1/team.js";
import { v1IncidentRoutes } from "./api/v1/incident.js";
import { v1NotifRoutes } from "./api/v1/notif.js";

import authenticateToken from "./middlewares/auth/authenticateToken.js";

config();

const app = express();
let port;
if (process.env.DEV == "true")
  port = Number(process.env.DEV_PORT) || 8001;
else
  port = Number(process.env.PORT) || 8000;

const serveIp = process.env.SERVE_IP || "127.0.0.1";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "./logs/NOC_System.log"),
  { flags: "a" }
);

morgan.token('body', (req) => {
  return JSON.stringify(req.body) || '-';
});

const morganFormat = ':remote-addr - - [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :body';

app.use(cors());
app.use(express.json());
app.use(morgan("combined"));
app.use(morgan(morganFormat, {
  stream: accessLogStream,
  skip: function (req, res) { return res.statusCode < 400 }
}));

// api v1 routes
app.use("/api/v1/auth",     v1AuthRoutes);
app.use("/api/v1/webhook",  authenticateToken, v1WebhookRoutes);
app.use("/api/v1/pack",     authenticateToken, v1PackRoutes);
app.use("/api/v1/user",     authenticateToken, v1UserRoutes);
app.use("/api/v1/team",     authenticateToken, v1TeamRoutes);
app.use("/api/v1/incident", authenticateToken, v1IncidentRoutes);
app.use("/api/v1/notif",    authenticateToken, v1NotifRoutes);

// return 404 to all unknown routes
app.all("*", function (req, res) {
  res.status(404).json({
    message: "Not found",
  });
});

app.listen(port, serveIp, () => {
  console.log(`Server is running on ${serveIp}:${port}`);
});
