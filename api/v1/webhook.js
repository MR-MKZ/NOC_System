import { json, Router } from "express";
import { appendFile } from "fs/promises";
import { callAiWebhook } from "../../interfaces/aiWebhook.js";
import { saveNotication } from "../../models/notificationModel.js";
import { closePack, createPack, getPack } from "../../models/packModel.js";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import webhookController from "../../controllers/webhookController.js";

const router = Router();

router.post("/", webhookController);

export { router as v1WebhookRoutes };
