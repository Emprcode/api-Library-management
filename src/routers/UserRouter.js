import express from "express";
import { comparePassword, hashPassword } from "../helpers/bcryptHelper.js";
import { isAuth } from "../middlewares/authMiddleware.js";
import { createUser, getUserByEmail, getUserById, updateUserInfo } from "../models/users/UserModel.js";

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


//update password

router.patch("/password-update", isAuth, async(req, res, next)=> {
  try {
    const user = await getUserById(req.headers.authorization)
    const {currentPassword} = req.body

    const passMatch = comparePassword(currentPassword, user?.password)
    if (passMatch){
      const hashedPass = hashPassword(req.body.password)

      if (hashedPass) {
        const u = await updateUserInfo({_id:user._id}, {password:hashedPass})      

        u?._id ? res.json({
          status:"success",
          message:"Password Updated successfully!"
        }) : res.json({
          status:"error",
          message:"unable to update password, please try again later!"
        })
      }
      return res.json({
        status:"error",
        message:"unable to update password!"
      })
    }
  } catch (error) {
    
  }
})








export default router;
