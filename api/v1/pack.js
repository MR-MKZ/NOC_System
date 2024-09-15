import { Router } from "express";
import notificationController from "../../controllers/notificationController.js";

const router = Router()

router.get('/', notificationController.handleSendPacks);
router.get('/incidents', notificationController.handleSendIncidentPacks);
router.get('/:id', notificationController.handleSendNotifications)
router.post('/:id/predict-feedback', notificationController.predictFeedback)
router.post('/priority', notificationController.handlePackPriority)

export {
    router as v1PackRoutes
}