import { Router } from "express";
import notificationController from "../../controllers/notificationController";

const router = Router()

router.get('/', notificationController.getAllNotifications);

export {
    router as v1NotificationRoutes
}