import { Router } from "express";
import userController from "../../controllers/userController.js";
import userIsAdmin from "../../middlewares/userIsAdmin.js";

const router = Router()

router.post('/', userIsAdmin, userController.createUser);
router.get('/', userIsAdmin, userController.getAllUsers)
router.delete('/:id', userIsAdmin, userController.deleteUser)
router.put('/:id', userIsAdmin, userController.updateUser)

export {
    router as v1UserRoutes
}