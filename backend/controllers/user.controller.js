import User from "../models/user.model.js";
import * as userService from "../services/user.service.js";
import { validationResult } from "express-validator";

export const createUserController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await userService.createUser(req);
    const token = await user.generateJWT();

    delete user._doc.password;

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const loginController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  if (!email || !password) throw new Error("Email and password are required");

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        errors: "Invalid credentials",
      });
    }

    const isMatch = await user.isValidPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        errors: "Invalid credentials",
      });
    }

    const token = await user.generateJWT();

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      maxAge:  24 * 60 * 60 * 1000,
      path: '/', 
    });

    delete user._doc.password;

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const profileController = async (req, res) => {
  const user = req.user;
  res.status(200).json({ user: user });
};

export const logoutController = async (req, res) => {
  try {
    const token =
      req.header("Authorization")?.replace("Bearer ", "") || req.cookies.jwt;

    if (!token) {
      return res.status(400).json({ error: "No token provided" });
    }

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true, 
      sameSite: "strict", 
    });

    // Send a success response
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
