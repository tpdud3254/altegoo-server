require("dotenv").config();

import http from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import express from "express";
import usersRouter from "./routes/users/users";
import worksRouter from "./routes/works/works";
import adminRouter from "./routes/admin/admin";
import { WebSocket } from "ws";
import pointsRouter from "./routes/points/points";
// import { Server } from "socket.io";

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
app.use("/points", pointsRouter);
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
export const webSocketServer = new WebSocket.Server({
    server: httpServer,
});
// const webSocketServer = new Server(httpServer);

webSocketServer.on("connection", (ws, request) => {
    // 연결한 클라이언트 ip 확인
    const ip = request.socket.remoteAddress;

    console.log(`클라이언트 [${ip}] 접속`);
    console.log("socket.id", request.socket);

    // 연결이 성공
    if (ws.readyState === ws.OPEN) {
        console.log(`[${ip}] 연결 성공`);
    }

    // 메세지를 받았을 때 이벤트 처리
    ws.on("message", (msg) => {
        console.log(`${msg} [${ip}]`);
        // const data = JSON.parse(msg);
        // if (data.type === "REGIST") ws.send(data.msg);
    });

    // 에러 처리
    ws.on("error", (error) => {
        console.log(`에러 발생 : ${error} [${ip}]`);
    });

    // 연결 종료 처리
    ws.on("close", () => {
        console.log(`[${ip}] 연결 종료`);
    });

    process.on("REGIST", (param) => {
        //TODO: 자기 자신은 받지 않기
        ws.send(
            JSON.stringify({
                type: "REGIST",
                tts_msg: param.msg,
                exceptionUserId: param.userId,
            })
        );
    });

    // ws.close;
    // setInterval(() => ws.send("hello"), 3000);
});

httpServer.listen(PORT, handleListen);
