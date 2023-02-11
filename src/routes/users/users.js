import express from "express";
import { createAccount } from "../../services/users/createAccount";
import { login } from "../../services/users/login";

const usersRouter = express.Router();

//login
//editProfile
//getUser
//seeProfile
//changePassword

//usersRouter.get("/check", () => {});

usersRouter.post("/create", createAccount);
usersRouter.post("/login", login);

export default usersRouter;
