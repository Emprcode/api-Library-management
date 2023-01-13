import express from "express";
import { comparePassword, hashPassword } from "../helpers/bcryptHelper.js";
import { createUser, getUserByEmail } from "../models/users/UserModel.js";

const router = express.Router();

// post for registration
router.post("/", async (req, res, next) => {
  const { email } = req.body;
  try {
    const userExist = await getUserByEmail(email);
    if (userExist) {
      return res.json({
        status: "error",
        message: "user already exist! Please log in",
      });
    }

    //   encrypt password
    const hashPass = hashPassword(req.body.password);

    if (hashPass) {
      req.body.password = hashPass;
      const user = await createUser(req.body);

      user?._id
        ? res.json({
            status: "success",
            message: "User has been created successfully",
          })
        : res.json({
            status: "error",
            message: "Unable to create user, try again later",
          });
    }
  } catch (error) {
    next(error);
  }
});

// post for login

router.post("/login", async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await getUserByEmail(email);
    if (user?._id) {
      const isPassMatch = comparePassword(req.body.password, user.password);
      if (isPassMatch) {
        user.password = undefined;
        return res.json({
          status: "success",
          message: "Login Successful",
          user,
        });
      }
      res.json({
        status: "error",
        message: "user not found! Please try again later",
      });
    } else {
      res.json({
        status: "error",
        message: "user not found! Please try again later",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default router;
