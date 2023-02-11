import express from "express";
import { createAccount } from "../../services/users/createAccount";
import { getUser } from "../../services/users/getUser";
import { login } from "../../services/users/login";
import { setPassword } from "../../services/users/setPassword";

const usersRouter = express.Router();

//editProfile
//changePassword

//usersRouter.get("/check", () => {});

usersRouter.get("/user", getUser);

usersRouter.post("/create", createAccount);
usersRouter.post("/login", login);
usersRouter.post("/password", setPassword);

export default usersRouter;
