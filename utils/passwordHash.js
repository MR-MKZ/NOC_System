import bcrypt from "bcrypt"

/**
 * hash password to make it more secure
 * @param {string} password 
 * @returns hashed password
 */
const hashPassword = (password) => {
    const salt = "$2b$10$2DFh6v2katdIWq0dGXJb5O"

    return bcrypt.hashSync(password, salt)
}

export default hashPassword;