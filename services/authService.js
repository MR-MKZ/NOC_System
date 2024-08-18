import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { JWT_EXPIRE } from "../config/config.js";

const login = async (username, password, userAgent) => {
  const user = await userModel.findByUsername(username);

  if (!user || !(await compare(password, user.password))) {
    return null;
  }
  return jwt.sign(
    {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      role: user.role,
      agent: userAgent
    },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
};

const checkUserRole = async (userId, role) => {
  try {
    const userData = await userModel.findById(userId);
    return userData && userData.role.englishName === role;
  } catch (error) {
    console.error(`Error fetching user data for userId: ${userId}`, error);
    return { error: "Internal Server Error" };
  }
};

export default {
  login,
  checkUserRole,
  isAdmin: (userId) => checkUserRole(userId, "admin"),
  isSupport: (userId) => checkUserRole(userId, "support"),
  isUser: (userId) => checkUserRole(userId, "user")
}