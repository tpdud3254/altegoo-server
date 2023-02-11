import express from "express";
import { createAccount } from "../../services/users/createAccount";
import { getUser } from "../../services/users/getUser";
import { login } from "../../services/users/login";

const usersRouter = express.Router();

//editProfile
//getUser
//seeProfile
//changePassword

//usersRouter.get("/check", () => {});

usersRouter.get("/user", getUser);

usersRouter.post("/create", createAccount);
usersRouter.post("/login", login);

export default usersRouter;
