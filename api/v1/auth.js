import { Router } from "express";
import validateLogin from "../../middlewares/auth/validateLoginData.js";
// import authenticateToken from "../../middlewares/auth/authenticateToken.js"
import authenticateToken from "../../middlewares/auth/authenticateToken.js"
import authController from "../../controllers/authController.js";

const router = Router()

router.post('/login', validateLogin, authController.login);
router.post('/verify-token', authenticateToken, authController.verifyToken);

// router.post('/login', validateLogin, authController.login);
// router.post('/verify-token', authenticateToken, authController.verifyToken);

export {
    router as v1AuthRoutes
}