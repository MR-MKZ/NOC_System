import { Router } from "express";
import userIsAdmin from "../../middlewares/userIsAdmin.js";
import teamController from "../../controllers/teamController.js";

const router = Router()

router.post('/', userIsAdmin, teamController.createTeam)
router.get('/', userIsAdmin, teamController.allTeams)
router.put('/:id', userIsAdmin, teamController.updateTeam)
router.delete('/:id', userIsAdmin, teamController.deleteTeam)
router.post('/:id/member', userIsAdmin, teamController.addTeamMember)
router.delete('/:id/member', userIsAdmin, teamController.removeTeamMember)

export {
    router as v1TeamRoutes
}