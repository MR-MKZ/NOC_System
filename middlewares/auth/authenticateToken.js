import { messages } from '../../config/messages.js';
import jwt from 'jsonwebtoken';

const authenticateToken = async (req, res, next) => {
    // برای بررسی لودینگ در فرانت 
    // await new Promise(r => setTimeout(r, 5000));
    const token = req.headers['authorization'];
    console.log(req.headers['user-agent']);
    if (!token) {
        return res.status(messages.UNAUTHORIZED.code).json({ error: messages.UNAUTHORIZED.message });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.agent !== req.headers['user-agent']) {
            return res.status(messages.UNAUTHORIZED.code).json({ error: messages.UNAUTHORIZED.message });
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(messages.UNAUTHORIZED.code).json({ error: messages.UNAUTHORIZED.message });
    }
};

export default authenticateToken