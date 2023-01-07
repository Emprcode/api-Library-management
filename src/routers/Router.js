import express from 'express'

const router = express.Router()

router.get("/", (req, res, next) => {
    res.json({
      status: "success",
      message: "Connected",
    });
  });
router.post("/", (req, res, next) => {
    res.json({
      status: "success",
      message: "posted",
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