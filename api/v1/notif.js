import { Router } from "express";
import notificationController from "../../controllers/notificationController.js";

const router = Router()

router.get('/overview', notificationController.openNotificationsOverview);
router.get('/all-overview', notificationController.allNotificationsOverview);

export {
    router as v1NotifRoutes
}