const express = require("express");
const UserController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/getUser", authMiddleware(["admin"]), UserController.getUser);
router.delete(
    "/deleteUser",
    authMiddleware(["admin"]),
    UserController.deleteUserByAccount
);
router.put(
    "/updateUser",
    authMiddleware(["admin", "user"]),
    UserController.updateUserByAccount
);
router.put(
    "/changePassword",
    authMiddleware(["admin", "user"]),
    UserController.changePassword
);
router.put(
    "/resetPassword",
    authMiddleware(["admin"]),
    UserController.resetPassword
);

module.exports = router;
