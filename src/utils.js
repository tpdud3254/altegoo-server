import prisma from "./prisma";
import jwt from "jsonwebtoken";
import AWS from "aws-sdk";
import multer from "multer";
import axios from "axios";
import { scheduleJob } from "node-schedule";
const ID = process.env.AWS_ACCESS_KEY_ID;
const SECRET = process.env.AWS_SECRET_ACCESS_KEY;
const BUCKET_NAME = "altegoo-bucket";

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
                  type: true,
              },
          })
        : null;

    const vehicle = await prisma.vehicle.findMany({
        where: { userId: user.id },
        select: {
            number: true,
            type: true,
            floor: true,
            weight: true,
        },
    });

    const workCategory = user.workCategoryId
        ? await prisma.workCategory.findUnique({
              where: { id: user.workCategoryId },
              select: {
                  name: true,
                  code: true,
              },
          })
        : null;

    const workRegion = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
            workRegion: true,
        },
    });

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
        vehicle: vehicle.length > 0 ? vehicle : null,
        workCategory: workCategory ? workCategory : null,
        workRegion:
            workRegion.workRegion.length > 0 ? workRegion.workRegion : null,
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

export const getRegionToString = (regionId) => {
    switch (regionId) {
        case 1:
            return "서울";
        case 2:
            return "인천";
        case 3:
            return "경기 북서부";
        case 4:
            return "경기 북동부";
        case 5:
            return "경기 남서부";
        case 6:
            return "경기 남동부";
        default:
            return "";
    }
};

const EXPO_PUSH_SERVER = "https://exp.host/--/api/v2/push/send";
export const PUSH_SCHEDULE = [];

const getOrders = async () => {
    const now = new Date();
    const results = [];

    const orders = await prisma.order.findMany({
        where: {
            OR: [
                { orderStatusId: 2 },
                { orderStatusId: 3 },
                { orderStatusId: 4 },
                { orderStatusId: 5 },
            ],
        },
        orderBy: {
            orderStatusId: "asc",
        },
    });

    orders.map((order) => {
        const orderDate = new Date(order.dateTime);

        if (now < orderDate) results.push(order);
    });

    return results;
};

const getHours = (dateTime, hours) => {
    const compareDateTime = new Date(dateTime);
    compareDateTime.setHours(compareDateTime.getHours() - hours);

    return compareDateTime;
};

const getMins = (dateTime, mins) => {
    const now = new Date();
    const compareDateTime = new Date(dateTime);
    compareDateTime.setMinutes(compareDateTime.getMinutes() - mins);

    if (now > compareDateTime) return false;

    return compareDateTime;
};

export const getUserExpoToken = async (id) => {
    const user = await prisma.user.findUnique({
        where: { id },
        select: { pushToken: true },
    });

    if (!user) return false;

    return user.pushToken;
};

export const initPushForWorks = async () => {
    const orders = await getOrders();

    await Promise.all(
        orders.map(async (order) => {
            await addPushForWorks(order);
        })
    );
    console.log("PUSH_SCHEDULE : ", PUSH_SCHEDULE);
};

export const addPushForWorks = async (order) => {
    const pushToken = await getUserExpoToken(order.acceptUser);

    if (!pushToken) return;

    const orderDateTime = new Date(order.dateTime);
    const orderMonth = orderDateTime.getMonth() + 1;
    const orderDate = orderDateTime.getDate();
    const orderHours = orderDateTime.getHours();
    const orderMins = orderDateTime.getMinutes();

    const before24Hours = getHours(order.dateTime, 24);
    const before12Hours = getHours(order.dateTime, 12);
    const before2Hours = getHours(order.dateTime, 2);
    const before10Mins = getMins(order.dateTime, 10);
    const after5Hours = getHours(order.dateTime, -5);

    const schedules = [];

    if (before24Hours) {
        const before24HoursJob = scheduleJob(before24Hours, async function () {
            const push = await sendPushToUser(
                pushToken,
                "작업 시작 예정",
                `${orderMonth}월 ${orderDate}일 ${orderHours}시 ${orderMins}분 ${getRegionToString(
                    order.regionId
                )}지역의 작업이 24시간 뒤 시작될 예정입니다.`
            );
        });

        if (before24HoursJob) schedules.push(before24HoursJob);
    }

    if (before12Hours) {
        const before12HoursJob = scheduleJob(before12Hours, async function () {
            const push = await sendPushToUser(
                pushToken,
                "작업 시작 예정",
                `${orderMonth}월 ${orderDate}일 ${orderHours}시 ${orderMins}분 ${getRegionToString(
                    order.regionId
                )}지역의 작업이 12시간 뒤 시작될 예정입니다.`
            );
        });

        if (before12HoursJob) schedules.push(before12HoursJob);
    }

    if (before2Hours) {
        const before2HoursJob = scheduleJob(before2Hours, async function () {
            const push = await sendPushToUser(
                pushToken,
                "작업 시작 예정",
                `${orderMonth}월 ${orderDate}일 ${orderHours}시 ${orderMins}분 ${getRegionToString(
                    order.regionId
                )}지역의 작업이 2시간 뒤 시작될 예정입니다.`,
                { screen: "OrderProgress", order }
            );
        });
        if (before2HoursJob) schedules.push(before2HoursJob);
    }

    if (before10Mins) {
        const before10MinsJob = scheduleJob(before10Mins, async function () {
            const push = await sendPushToUser(
                pushToken,
                "작업 시작 예정",
                `${orderMonth}월 ${orderDate}일 ${orderHours}시 ${orderMins}분 ${getRegionToString(
                    order.regionId
                )}지역의 작업이 10분 뒤 시작될 예정입니다.`,
                { screen: "OrderProgress", order }
            );
        });

        if (before10MinsJob) schedules.push(before10MinsJob);
    }

    const startAtTimeJob = scheduleJob(orderDateTime, async function () {
        const push = await sendPushToUser(
            pushToken,
            "작업 시작",
            "작업 시작을 누르고 작업을 시작해 주세요.",
            { screen: "OrderProgress", order }
        );
    });

    if (startAtTimeJob) schedules.push(startAtTimeJob);

    const after5HoursJob = scheduleJob(after5Hours, async function () {
        const push = await sendPushToUser(
            pushToken,
            "작업 진행 중 이신가요?",
            "작업이 완료되면 작업 완료를 눌러주세요.",
            { screen: "OrderProgress", order }
        );
    });

    if (after5HoursJob) schedules.push(after5HoursJob);

    PUSH_SCHEDULE.push({
        orderId: order.id,
        schedules,
    });
};

export const deletePushForWorks = async (order) => {
    PUSH_SCHEDULE.map((pushSchedule, index) => {
        if (pushSchedule.orderId === order.id) {
            pushSchedule.schedules.map((schedule) => {
                schedule.cancel();
            });
            PUSH_SCHEDULE.splice(index, 1);
        }
    });

    console.log(PUSH_SCHEDULE);
};

function chunkArr(data = [], size = 10) {
    const arr = [];

    for (let i = 0; i < data.length; i += size) {
        arr.push(data.slice(i, i + size));
    }

    return arr;
}

export const sendPushToUser = async (expoToken, title, body, data) => {
    try {
        const response = await axios.post(EXPO_PUSH_SERVER, {
            to: expoToken,
            title,
            body,
            data,
            sound: "default",
            priority: "high",
        });

        if (!response) throw new Error("푸시 알림 전송에 실패하였습니다.");

        return response;
    } catch (error) {
        return false;
    }
};

export const sendPushToUsers = async (expoTokenList, title, body, data) => {
    try {
        const chunkedArr = chunkArr(expoTokenList, 100);
        const responseArr = [];

        await Promise.all(
            chunkedArr.map(async (value, index) => {
                const response = await axios.post(EXPO_PUSH_SERVER, {
                    to: [...value],
                    title,
                    body,
                    data,
                    sound: "default",
                    priority: "high",
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

export const sendPushToAllUsers = async (title, body, data) => {
    try {
        const userTokenList = await prisma.user.findMany({
            select: {
                pushToken: true,
            },
        });

        const expoTokenList = [];
        userTokenList.map((value) => {
            expoTokenList.push(value.pushToken);
        });

        const chunkedArr = chunkArr(expoTokenList, 100);
        const responseArr = [];

        await Promise.all(
            chunkedArr.map(async (value, index) => {
                const response = await axios.post(EXPO_PUSH_SERVER, {
                    to: [...value],
                    title,
                    body,
                    data,
                    sound: "default",
                    priority: "high",
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
