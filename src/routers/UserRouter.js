import express from "express";
import { hashPassword } from "../helpers/bcryptHelper.js";
import { createUser, getUserByEmail } from "../models/users/UserModel.js";

const router = express.Router();

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

router.get("/", (req, res, next) => {
  res.json({
    status: "success",
    message: "Connected",
  });
});
router.put("/", (req, res, next) => {
  res.json({
    status: "success",
    message: "updated",
  });
});
router.delete("/", (req, res, next) => {
  res.json({
    status: "success",
    message: "deleted",
  });
});

export default router;
