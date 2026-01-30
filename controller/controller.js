import { userModel, TodoModel } from "../model/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const isExist = await userModel.findOne({ email });
    if (isExist) {
      res.json({
        success: false,
        code: 400,
        message: "User Already Exists.",
        data: isExist,
        error: true,
      });
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const data = new userModel({ name, email, password: hashPassword });
      const result = await data.save();
      res.json({
        success: true,
        code: 200,
        message: "User Register Successfully!",
        data: result,
        error: false,
      });
    }
  } catch (err) {
    res.json({
      success: false,
      code: 500,
      message: "Internal Server Error.",
      data: [],
      error: true,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await userModel.findOne({ email });
    if (data) {
      const isMatch = await bcrypt.compare(password, data.password);
      if (isMatch) {
        const payload = { email: data.email };
        const token = jwt.sign(payload, "jwt_secret", { expiresIn: "1h" });
        res.json({
          success: true,
          code: 200,
          message: "Login Successfully ! ",
          data: data,
          token,
          error: false,
        });
      } else {
        res.json({
          success: false,
          code: 400,
          message: "Invalid Credentials login failed! ",
          data: "",
          error: true,
        });
      }
    } else {
      res.json({
        success: false,
        code: 404,
        message: "User Not Found",
        data: "",
        error: true,
      });
    }
  } catch (error) {
    res.json({
      success: false,
      code: 500,
      message: "Internal Server Error",
      data: "",
      error: true,
    });
  }
};

export const createToduController = async (req, res) => {
  try {
    const { name, status } = req.body;
    const isExist = await TodoModel.findOne({ name });
    if (isExist) {
      res.json({
        success: false,
        code: 400,
        message: "Name already exists",
        data: "",
        error: true,
      });
    } else {
      const data = new TodoModel({ name, status });
      const result = await data.save();
      res.json({
        success: true,
        code: 200,
        message: "Todo created!",
        data: result,
        error: false,
      });
    }
  } catch (err) {
    res.json({
      success: false,
      code: 500,
      message: "Internal Server Error",
      data: "",
      error: true,
    });
  }
};

export const getTodoController = async (req, res) => {
  try {
    const result = await TodoModel.find();
    res.json({
      success: true,
      code: 200,
      message: "Todo get!",
      data: result,
      error: false,
    });
  } catch (err) {
    res.json({
      success: false,
      code: 500,
      message: "Internal Server Error",
      data: "",
      error: true,
    });
  }
};

export const deleteTodoController = async (req, res) => {
  try {
    const {id}=req.params;
   const result=  await TodoModel.deleteOne({_id:id})
    res.json({
      success: true,
      code: 200,
      message: "DELETED",
      data:result,
      error: false,
    });
  } catch (err) {
    res.json({
      success: false,
      code: 500,
      message: "Internal Server Error",
      data: "",
      error: true,
    });
  }
};

export const UpdateTodoController = async (req, res) => {
  try {
    const {id}=req.params;
    const {name,status}=req.body;
   const result=  await TodoModel.updateOne({_id:id},{$set:{name,status}})
    res.json({
      success: true,
      code: 200,
      message: "Updated",
      data:result,
      error: false,
    });
  } catch (err) {
    res.json({
      success: false,
      code: 500,
      message: "Internal Server Error",
      data: "",
      error: true,
    });
  }
};
