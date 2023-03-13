require("dotenv").config();

import http from "http";
// import SocketIO from "socket.io";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import express from "express";
import usersRouter from "./routes/users/users";
import worksRouter from "./routes/works/works";
import adminRouter from "./routes/admin/admin";

const cors = require("cors");
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// app.use((req, res) => {
//   res.setHeader("Access-Control-Allow-origin", "*"); // 모든 출처(orogin)을 허용
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   ); // 모든 HTTP 메서드 허용
//   res.setHeader("Access-Control-Allow-Credentials", "true"); // 클라이언트와 서버 간에 쿠키 주고받기 허용

//   // res.writeHead(200, { 'Content-Type': 'text/plain' });
//   res.end("ok");
// });

app.get("/", (_, res) => res.status(200).json({ result: true }));
app.use("/users", usersRouter);
app.use("/works", worksRouter);
app.use("/admin", adminRouter);
app.get("/*", (_, res) => res.redirect("/"));

app.use((err, req, res, next) => {
  console.log("500 err : ", err);
  res.status(500).json({
    result: "INVALID",
    msg: err.message,
  });
});

const handleListen = () => console.log(`Listening on http://localhost:${PORT}`);

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});

instrument(wsServer, {
  auth: false,
});

// socket.io admin panel auth setting
// instrument(wsServer, {
//     auth: {
//         type: "basic",
//         username: "admin",
//         password:
//             "$2b$10$heqvAkYMez.Va6Et2uXInOnkCT6/uQj1brkrbyG3LpopDklcq7ZOS",
//     },
// });

httpServer.listen(PORT, handleListen);
