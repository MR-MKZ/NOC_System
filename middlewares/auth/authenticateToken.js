import { messages } from '../../config/messages.js';
import jwt from 'jsonwebtoken';

const authenticateToken = async (req, res, next) => {
    let token = req.headers['authorization'];

    if (!token) {
        return res.status(messages.UNAUTHORIZED.code).json({ message: messages.UNAUTHORIZED.message });
    }
    try {
        token = token.split("Bearer")
        token = token[1].trim()
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.agent !== req.headers['user-agent']) {
            return res.status(messages.UNAUTHORIZED.code).json({ message: messages.UNAUTHORIZED.message });
        }
        req.user = decoded;
        next()
    } catch (error) { 
        return res.status(messages.UNAUTHORIZED.code).json({ message: messages.UNAUTHORIZED.message });
    }
};

export default authenticateToken