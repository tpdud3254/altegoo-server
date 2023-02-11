import express from "express";
import { createAccount } from "../../services/users/createAccount";
import { getUser } from "../../services/users/getUser";
import { login } from "../../services/users/login";
import { setPassword } from "../../services/users/setPassword";
import { editProfile } from "../../services/users/editProfile";
import { auth } from "../../utils";

const usersRouter = express.Router();

//editProfile

//usersRouter.get("/check", () => {});

usersRouter.get("/user", getUser);

usersRouter.post("/create", createAccount);
usersRouter.post("/login", login);
usersRouter.post("/password", setPassword);
usersRouter.post("/edit", auth, editProfile);

export default usersRouter;
