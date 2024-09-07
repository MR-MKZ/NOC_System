import { Router } from "express";
import incidentController from "../../controllers/incidentController.js";

const router = Router()

router.post('/', incidentController.createIncident);
router.post('/assign', incidentController.assignIncident);
router.post('/report', incidentController.reportIncident);

export {
    router as v1IncidentRoutes
}