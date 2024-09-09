import { Router } from "express";
import incidentController from "../../controllers/incidentController.js";
import userIs724 from "../../middlewares/userIs724.js"
import userIsHead from "../../middlewares/userIsHead.js"

const router = Router()

router.post('/', userIs724, incidentController.createIncident);
router.post('/resolve/:id', incidentController.resolveIncident);
router.post('/assign', userIsHead, incidentController.assignIncident);
// router.post('/report', incidentController.reportIncident);

export {
    router as v1IncidentRoutes
}