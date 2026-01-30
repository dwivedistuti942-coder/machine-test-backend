import express, { json } from "express";
import jwt from "jsonwebtoken";
import {
  loginController,
  registerController,
  createToduController,
  getTodoController,
  deleteTodoController,
  UpdateTodoController
} from "../controller/controller.js";
const router = express.Router(); 
const AuthMiddleware = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.json({
        success: false,
        code: 404,
        message: "Token is requited!.",
        data: "",
        error: true,
      });
  }
  const rawToken = req?.headers?.authorization?.split(" ");
  const token = rawToken[1];

  jwt.verify(token, "jwt_secret", (err, decode) => {
    if (err) {
      return res.json({
        success: false,
        code: 400,
        message: "Invalid Or Expired token.",
        data: "",
        error: true,
      });
    } else {
      req.user = decode;
      next();
    }
  });
};
router.post("/register", registerController);
router.post("/login", loginController); 
router.post("/create-todo", AuthMiddleware, createToduController);
router.get("/get-todo", AuthMiddleware,getTodoController );
router.delete("/del-todo/:id", AuthMiddleware,deleteTodoController );
router.put("/update-todo/:id", AuthMiddleware,UpdateTodoController );
export default router;
