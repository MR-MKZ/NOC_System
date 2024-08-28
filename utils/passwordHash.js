import bcrypt from "bcrypt"

/**
 * hash password to make it more secure
 * @param {string} password 
 * @returns hashed password
 */
const hashPassword = (password) => {
    const salt = process.env.HASH_SALT
    return bcrypt.hashSync(password, salt)
}

export default hashPassword;