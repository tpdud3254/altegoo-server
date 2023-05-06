import prisma from "./prisma";
import jwt from "jsonwebtoken";
import AWS from "aws-sdk";
import multer from "multer";
import axios from "axios";
const ID = process.env.AWS_ACCESS_KEY_ID;
const SECRET = process.env.AWS_SECRET_ACCESS_KEY;
const BUCKET_NAME = "altegoo-bucket";
import { Expo } from "expo-server-sdk";

const s3 = new AWS.S3({ accessKeyId: ID, secretAccessKey: SECRET });

export const uploadFile = (file, type) => {
    const key = `${type}/${Date.now()}_${file.originalname}`;

    console.log(key);
    const params = { Bucket: BUCKET_NAME, Key: key, Body: file.buffer };
    s3.upload(params, function (err, data) {
        if (err) {
            throw err;
        }
        console.log(`File upload successfully. ${data.Location}`);
        return data.Location;
    });
};

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fieldSize: 25 * 1024 * 1024 },
});

export const existUser = async (phone) => {
    if (!phone) throw new Error("사용자를 찾을 수 없습니다.");

    const user = await prisma.user.findUnique({
        where: { phone },
        include: { point: true },
    });

    if (!user) throw new Error("사용자를 찾을 수 없습니다.");

    return user;
};

export const craeteUserId = (code, id) => {
    return code + String(id).padStart(5, "0");
};

export const auth = async (req, res, next) => {
    const token = req.headers.auth;

    console.log("token: ", token);

    if (!token) throw new Error("사용자를 찾을 수 없습니다.");

    try {
        const { id } = jwt.verify(token, process.env.SECRET_KEY);

        if (!id) throw new Error("사용자를 찾을 수 없습니다.");

        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) throw new Error("사용자를 찾을 수 없습니다.");

        req.id = user.id;
        next();
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};

export const getUserRestInfo = async (user) => {
    const userType = user.userTypeId
        ? await prisma.userType.findUnique({
              where: {
                  id: user.userTypeId,
              },
              select: {
                  code: true,
                  type: true,
                  category: true,
              },
          })
        : null;

    const vehicleWeight = user.vehicleWeightId
        ? await prisma.vehicleWeight.findUnique({
              where: {
                  id: user.vehicleWeightId,
              },
              select: { weight: true },
          })
        : null;

    const vehicleType = user.vehicleTypeId
        ? await prisma.vehicleType.findUnique({
              where: {
                  id: user.vehicleTypeId,
              },
              select: { type: true },
          })
        : null;

    const workRegion = user.id
        ? await prisma.user.findMany({
              where: { id: user.id },
              select: {
                  workRegion: {
                      select: {
                          id: true,
                      },
                  },
              },
          })
        : null;

    const workRegionArr = [];
    workRegion[0].workRegion.map((value) => {
        workRegionArr.push(value.id);
    });

    console.log(workRegionArr);

    const grade = user.gradeId
        ? await prisma.grade.findUnique({
              where: {
                  id: user.gradeId,
              },
              select: { grade: true },
          })
        : null;

    const info = {
        userType: userType?.type ? userType.type : null,
        workCategory: userType?.category ? userType.category : null,
        vehicleWeight: vehicleWeight?.weight ? vehicleWeight.weight : null,
        vehicleType: vehicleType?.type ? vehicleType.type : null,
        workRegion: workRegionArr,
        grade: grade?.grade ? grade.grade : null,
    };

    return info;
};

export const asyncWrap = (asyncController) => {
    return async (req, res, next) => {
        try {
            await asyncController(req, res);
        } catch (error) {
            console.log("asyncWrap error : ", error);
            next(error);
        }
    };
};

export const setErrorJson = (msg) => {
    return { result: "INVALID", msg };
};

export const setResponseJson = (data) => {
    return { result: "VALID", data: data };
};

export const checkAcceptUser = async (orderId, id) => {
    const order = await prisma.order.findUnique({
        where: {
            id: orderId,
        },
    });

    console.log("order.acceptUser : ", order.acceptUser);
    console.log("acceptUser id : ", id);

    if (order.acceptUser !== id) throw new Error("사용자와 작업자 불일치");

    return true;
};

export const checkRegistUser = async (orderId, id) => {
    const order = await prisma.order.findUnique({
        where: {
            id: orderId,
        },
        select: {
            registUser: {
                select: {
                    id: true,
                },
            },
        },
    });

    console.log("order.registUser.id : ", order.registUser.id);
    console.log("registUser id : ", id);
    if (order.registUser.id !== id) throw new Error("사용자와 등록자 불일치");

    return true;
};

const EXPO_PUSH_SERVER = "https://exp.host/--/api/v2/push/send";

function chunkArr(data = [], size = 10) {
    const arr = [];

    for (let i = 0; i < data.length; i += size) {
        arr.push(data.slice(i, i + size));
    }

    return arr;
}

export const sendPushToUser = async (expoToken, title, body) => {
    try {
        const response = await axios.post(EXPO_PUSH_SERVER, {
            to: expoToken,
            title,
            body,
            sound: "default",
            priority: "normal",
        });

        if (!response) throw new Error("푸시 알림 전송에 실패하였습니다.");

        return response;
    } catch (error) {
        return false;
    }
};

export const sendPushToUsers = async (expoTokenList, title, body) => {
    try {
        const chunkedArr = chunkArr(expoTokenList, 100);
        const responseArr = [];

        await Promise.all(
            chunkedArr.map(async (value, index) => {
                const response = await axios.post(EXPO_PUSH_SERVER, {
                    to: [...value],
                    title,
                    body,
                    sound: "default",
                    priority: "normal",
                });

                if (!response)
                    throw new Error("푸시 알림 전송에 실패하였습니다.");

                responseArr.push(response);
            })
        );
        return responseArr;
    } catch (error) {
        return false;
    }
};

export const sendPushToAllUsers = async (title, body) => {
    try {
        const userTokenList = await prisma.user.findMany({
            select: {
                pushToken: true,
            },
        });

        const expoTokenList = [];
        userTokenList.map((value) => {
            if (value.pushToken !== "none") expoTokenList.push(value.pushToken); //TODO: ㅇ에러처리 수정
        });

        const chunkedArr = chunkArr(expoTokenList, 100);
        const responseArr = [];

        await Promise.all(
            chunkedArr.map(async (value, index) => {
                const response = await axios.post(EXPO_PUSH_SERVER, {
                    to: [...value],
                    title,
                    body,
                    sound: "default",
                    priority: "normal",
                });

                if (!response)
                    throw new Error("푸시 알림 전송에 실패하였습니다.");

                responseArr.push(response);
            })
        );
        return responseArr;
    } catch (error) {
        return false;
    }
};
