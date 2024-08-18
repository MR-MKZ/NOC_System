import { verify } from 'jsonwebtoken';
import { messages } from '../config/messages';
import { isAdmin } from '../services/authService';

const userIsAdmin = async (req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(messages.UNAUTHORIZED.code).json(messages.UNAUTHORIZED.message);
        }

        const tokenData = verify(token, process.env.JWT_SECRET);
        const { userId } = tokenData;

        const adminCheck = await isAdmin(userId);
        if (adminCheck) {
            return next();
        }

        return res.status(messages.UNAUTHORIZED.code).json(messages.UNAUTHORIZED.message);
    } catch (error) {
        console.error(error);
        return res.status(messages.SERVER_ERROR.code).json(messages.SERVER_ERROR.message);
    }
};

module.exports = userIsAdmin;
