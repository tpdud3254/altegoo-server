import express from "express";
import { auth } from "../../utils";
import { registWork } from "../../services/works/registWork";
import { getWorkList } from "../../services/works/getWorkList";

const worksRouter = express.Router();

worksRouter.get("/list", auth, getWorkList);

worksRouter.post("/upload", auth, registWork);

export default worksRouter;
