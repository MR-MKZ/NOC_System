import userModel from "../models/userModel.js"




/**
 * create new user controller
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
const createUser = async (req, res) => {
    const { username, password, email, role } = req.params;

    // TODO: Add user api.
}