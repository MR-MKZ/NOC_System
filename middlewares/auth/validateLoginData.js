import { messages } from "../../config/messages.js";
import * as yup from "yup"

const loginSchema = yup.object().shape({  
    username: yup.string().required(messages.MISSING_USERNAME.message).nullable(),  
    password: yup.string().required(messages.MISSING_PASSWORD.message).nullable()  
});  

const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(messages.BAD_REQUEST.code).json({ errors: error.details.map(err => err.message) });
    }
    next();
};

export default validateLogin