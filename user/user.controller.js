import express from "express";
import Yup from "yup";
import User from "./user.model.js";
import bcrypt from "bcrypt";
import {
  loginUserValidationSchema,
  userValidationSchema,
} from "./user.validation.js";
import validateReqBody from "../middleware/validation.req.body.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// *register user
router.post(
  "/user/register",
  async (req, res, next) => {
    //extract data from req.body
    const data = req.body;

    //validate data

    try {
      //validate data
      const validatedData = await userValidationSchema.validate(data);
    } catch (error) {
      //if validation fails, throw error
      return res.status(400).send({ message: error.message });
    }

    //call next function

    next();
  },
  async (req, res) => {
    //extract new user from req.body
    const newUser = req.body;

    //find user using email
    const user = await User.findOne({ email: newUser.email });

    //if user exists throw error
    if (user) {
      return res.status(409).send({ message: "Email already exits..." });
    }

    //hash password
    const plainPassword = newUser.password;
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRound);
    newUser.password = hashedPassword;

    await User.create(newUser);

    return res.status(201).send("Register...");
  }
);

// *login
router.post(
  "/user/login",
  validateReqBody(loginUserValidationSchema),

  async (req, res) => {
    //extract loginCredentials from req.body
    const loginCredentials = req.body;

    //find user using email
    const user = await User.findOne({ email: loginCredentials.email });

    //if not user, throw error
    if (!user) {
      return res.status(404).send({ message: "Invalid Credentials" });
    }

    //compare password using bcrypt
    const plainPassword = loginCredentials.password;
    const hashedPassword = user.password;
    const isPassword = await bcrypt.compare(plainPassword, hashedPassword);

    //if not password match, throw error
    if (!isPassword) {
      return res.status(404).send({ message: "Invalid characters" });
    }

    //generate access token
    const payload = { email: user.email };
    const secretKey = process.env.ACCESS_TOKEN_SECRET_KEY;
    const token = jwt.sign(payload, secretKey);

    //send res

    return res
      .status(201)
      .send({ message: "success", userDetails: user, accessToken: token });
  }
);

export default router;
