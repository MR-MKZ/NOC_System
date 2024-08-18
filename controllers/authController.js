// const authService = require('../services/authService');
// const messages = require('../config/messages');
import authService from "../services/authService.js"
import { messages } from "../config/messages.js";

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const token = await authService.login(username, password, req.headers['user-agent']);
        if (!token) {
            return res.status(messages.INVALID_CREDENTIALS.code).json({ error: messages.INVALID_CREDENTIALS.message });
        }
        res.json({ token });
    } catch (error) {
        res.status(messages.SERVER_ERROR.code).json({ error: messages.SERVER_ERROR.message });
    }
};

const verifyToken = async (req, res) => {
    res.json({ message: messages.TOKEN_VALID.message });
};

export default {
    login,
    verifyToken
}