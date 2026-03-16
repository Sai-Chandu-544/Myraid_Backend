const router = require("express").Router();
const middleware=require("../middleware/authMiddleware")
const { register, login,createTask, getTasks , getSingleTask, updateTask,deleteTask} = require("../controllers/userController");
const {validateTask} =require("../middleware/validateTask")

router.post("/register", register);
router.post("/login", login);
app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/"
  });

  res.status(200).json({ message: "Logged out successfully" });
});
router.get("/me", middleware, (req, res) => {
  res.json({
    user: req.user
  });
});
router.post("/createTask", middleware, createTask);
router.get("/getTasks", middleware, getTasks);
router.get("/task/:id", middleware, getSingleTask);
router.put("/:id",middleware,validateTask,updateTask);

router.delete("/:id",middleware,deleteTask);


module.exports = router;