import { Router } from "express";
import notificationController from "../../controllers/notificationController.js";

const router = Router()

router.get('/', notificationController.handleSendPacks);
router.get('/:id', notificationController.handleSendNotifications)

export {
    router as v1NotificationRoutes
}