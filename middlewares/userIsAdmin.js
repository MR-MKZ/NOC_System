import jwt from 'jsonwebtoken';
import { messages } from '../config/messages.js';
import authService from '../services/authService.js';

const userIsAdmin = async (req, res, next) => {
    try {
        let token = req.headers['authorization'];
        token = token.split("Bearer")
        token = token[1].trim()
        
        if (!token) {
            return res.status(messages.UNAUTHORIZED.code).json({
                message: messages.UNAUTHORIZED.message
            });
        }

        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        let { userId } = tokenData;
        userId = parseInt(userId)

        if (isNaN(userId)) {
            return res.status(messages.UNAUTHORIZED.code).json({
                message: messages.UNAUTHORIZED.message
            });
        }

        const adminCheck = await authService.isAdmin(userId);
        if (adminCheck) {
            return next();
        }

        return res.status(messages.UNAUTHORIZED.code).json({
            message: messages.UNAUTHORIZED.message
        });
    } catch (error) {
        console.error(error);
        return res.status(messages.SERVER_ERROR.code).json({
            message: messages.SERVER_ERROR.message
        });
    }
};

export default userIsAdmin
