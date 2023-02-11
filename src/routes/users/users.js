import express from "express";
import { createAccount } from "../../services/users/createAccount";

const usersRouter = express.Router();

//createAccount
//editProfile
//login
//getUser
//seeProfile
//changePassword

//usersRouter.get("/check", () => {});

usersRouter.post("/create", createAccount);

export default usersRouter;
