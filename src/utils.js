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
    const now = GetUTCDateTime();
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

    if (!orders || orders.length === 0) {
        return [];
    }
    orders.map((order) => {
        const orderDate = new Date(order.dateTime);
        const diff = now.getHours() - orderDate.getHours();
        console.log("diff : ", diff);
        if (now < orderDate || diff < 6) results.push(order);
    });

    return results;
};

const getHours = (dateTime, hours) => {
    const compareDateTime = new Date(dateTime);
    compareDateTime.setUTCHours(compareDateTime.getUTCHours() - hours);

    return compareDateTime;
};

const getMins = (dateTime, mins) => {
    const now = GetUTCDateTime();
    const compareDateTime = new Date(dateTime);
    compareDateTime.setUTCMinutes(compareDateTime.getUTCMinutes() - mins);

    if (now > compareDateTime) return false;

    return compareDateTime;
};

export const getUserExpoToken = async (id) => {
    if (!id) return false;
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
            const isExist = PUSH_SCHEDULE.findIndex(
                (e) => e.orderId === order.id
            );
            if (isExist !== -1) {
                console.log("이미 있음 ", isExist);
                return;
            }

            await addPushForWorks(order);
        })
    );
    // console.log("PUSH_SCHEDULE : ", PUSH_SCHEDULE);
};

export const addPushForWorks = async (order) => {
    const pushToken = await getUserExpoToken(order.acceptUser);

    if (!pushToken) return;

    const orderDateTime = new Date(order.dateTime);
    const orderMonth = orderDateTime.getUTCMonth() + 1;
    const orderDate = orderDateTime.getUTCDate();
    const orderHours = orderDateTime.getUTCHours();
    const orderMins = orderDateTime.getUTCMinutes();

    const before24Hours = getHours(order.dateTime, 24);
    const before12Hours = getHours(order.dateTime, 12);
    const before2Hours = getHours(order.dateTime, 2);
    const before10Mins = getMins(order.dateTime, 10);
    const after5Hours = getHours(order.dateTime, -5);

    const schedules = [];

    if (before24Hours) {
        const before24HoursJob = scheduleJob(
            GetDateTime(before24Hours),
            async function () {
                const push = await sendPushToUser(
                    pushToken,
                    "작업 시작 예정",
                    `${orderMonth}월 ${orderDate}일 ${orderHours}시 ${orderMins}분 ${order.simpleAddress1} 작업이 24시간 뒤 시작될 예정입니다.`,
                    { screen: "DriverOrderProgress", orderId: order.id }
                );
            }
        );

        if (before24HoursJob) schedules.push(before24HoursJob);
    }

    if (before12Hours) {
        const before12HoursJob = scheduleJob(
            GetDateTime(before12Hours),
            async function () {
                const push = await sendPushToUser(
                    pushToken,
                    "작업 시작 예정",
                    `${orderMonth}월 ${orderDate}일 ${orderHours}시 ${orderMins}분 ${order.simpleAddress1} 작업이 12시간 뒤 시작될 예정입니다.`,
                    { screen: "DriverOrderProgress", orderId: order.id }
                );
            }
        );

        if (before12HoursJob) schedules.push(before12HoursJob);
    }

    if (before2Hours) {
        const before2HoursJob = scheduleJob(
            GetDateTime(before2Hours),
            async function () {
                const push = await sendPushToUser(
                    pushToken,
                    "작업 시작 예정",
                    `${orderMonth}월 ${orderDate}일 ${orderHours}시 ${orderMins}분 ${order.simpleAddress1} 작업이 2시간 뒤 시작될 예정입니다.`,
                    { screen: "DriverOrderProgress", orderId: order.id }
                );
            }
        );
        if (before2HoursJob) schedules.push(before2HoursJob);
    }

    if (before10Mins) {
        const before10MinsJob = scheduleJob(
            GetDateTime(before10Mins),
            async function () {
                const push = await sendPushToUser(
                    pushToken,
                    "작업 시작 예정",
                    `${orderMonth}월 ${orderDate}일 ${orderHours}시 ${orderMins}분 ${order.simpleAddress1} 작업이 10분 뒤 시작될 예정입니다.`,
                    { screen: "DriverOrderProgress", orderId: order.id }
                );
            }
        );

        if (before10MinsJob) schedules.push(before10MinsJob);
    }

    const startAtTimeJob = scheduleJob(
        GetDateTime(orderDateTime),
        async function () {
            const push = await sendPushToUser(
                pushToken,
                "작업 시간 입니다.",
                "작업 시작이 되지 않았으면 작업 시작을 눌러주세요.",
                { screen: "DriverOrderProgress", orderId: order.id }
            );
        }
    );

    if (startAtTimeJob) schedules.push(startAtTimeJob);

    const after5HoursJob = scheduleJob(
        GetDateTime(after5Hours),
        async function () {
            const push = await sendPushToUser(
                pushToken,
                "아직 작업 중이신가요?",
                "작업이 완료되면 작업 완료를 눌러주세요.",
                { screen: "DriverOrderProgress", orderId: order.id }
            );
        }
    );

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

const FCM_PUSH_SERVER = "https://fcm.googleapis.com/fcm/send";
export const sendPushToUser = async (
    expoToken,
    title,
    message,
    data,
    channelId
) => {
    try {
        await fetch(FCM_PUSH_SERVER, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `key=AAAAT6XyPEg:APA91bFYzu2tSoeg2MjUhSP0pvwXDpubxDKs7fVCG65vzv-a4bbrfjITSA6mtPe6Pqv4KpKckYaS-WeaET-zIuQ8PIsvnDfRK-6tSwbKKYXuW8IxZEoNLJKPHHB6wwn0bG3Tdhas1SYe`,
            },
            body: JSON.stringify({
                to: expoToken,
                priority: "high",
                data: {
                    title,
                    message,
                    data,
                    vibrate: true,
                    channelId: channelId ? channelId : "default",
                    priority: "high",
                },
            }),
        })
            .then((res) => {
                return res;
            })
            .catch(() => {
                throw new Error("푸시 알림 전송에 실패하였습니다.");
            });
    } catch (error) {
        return false;
    }
};

export const sendPushToUsers = async (
    expoTokenList,
    title,
    message,
    data,
    channelId
) => {
    try {
        const chunkedArr = chunkArr(expoTokenList, 100);
        const responseArr = [];

        await Promise.all(
            chunkedArr.map(async (value, index) => {
                await fetch(FCM_PUSH_SERVER, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `key=AAAAT6XyPEg:APA91bFYzu2tSoeg2MjUhSP0pvwXDpubxDKs7fVCG65vzv-a4bbrfjITSA6mtPe6Pqv4KpKckYaS-WeaET-zIuQ8PIsvnDfRK-6tSwbKKYXuW8IxZEoNLJKPHHB6wwn0bG3Tdhas1SYe`,
                    },
                    body: JSON.stringify({
                        registration_ids: [...value],
                        priority: "high",
                        data: {
                            title,
                            message,
                            data,
                            vibrate: true,
                            channelId: channelId ? channelId : "default",
                            priority: "high",
                        },
                    }),
                })
                    .then((res) => {
                        return res;
                    })
                    .catch(() => {
                        throw new Error("푸시 알림 전송에 실패하였습니다.");
                    });
            })
        );
        return responseArr;
    } catch (error) {
        return false;
    }
};

export const sendPushToAllUsers = async (title, message, data, channelId) => {
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
                await fetch(FCM_PUSH_SERVER, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `key=AAAAT6XyPEg:APA91bFYzu2tSoeg2MjUhSP0pvwXDpubxDKs7fVCG65vzv-a4bbrfjITSA6mtPe6Pqv4KpKckYaS-WeaET-zIuQ8PIsvnDfRK-6tSwbKKYXuW8IxZEoNLJKPHHB6wwn0bG3Tdhas1SYe`,
                    },
                    body: JSON.stringify({
                        registration_ids: [...value],
                        priority: "high",
                        data: {
                            title,
                            message,
                            data,
                            vibrate: true,
                            channelId: channelId ? channelId : "default",
                            priority: "high",
                        },
                    }),
                })
                    .then((res) => {
                        return res;
                    })
                    .catch(() => {
                        throw new Error("푸시 알림 전송에 실패하였습니다.");
                    });
            })
        );
        return responseArr;
    } catch (error) {
        return false;
    }
};

export const GetDateTime = (datetime) => {
    const curr = new Date(datetime);

    const kr_curr = curr.setHours(curr.getHours() - 9);

    const result = new Date(kr_curr);

    return result;
};

export const GetUTCDateTime = (datetime) => {
    let curr = null;

    if (datetime) curr = new Date(datetime);
    else curr = new Date();

    const kr_curr = curr.setHours(curr.getHours() + 9);

    const result = new Date(kr_curr);

    return result;
};

export const Callback = async (req, res, next) => {
    const { receipt_id, method_symbol, status } = req.body;

    console.log("payment callback : ", req.body);

    try {
        if (method_symbol === "vbank" && status === 1) {
            const vBankOrder = await prisma.vBankOrder.findUnique({
                where: {
                    receipt_id,
                },
            });

            req.id = vBankOrder.userId;
            req.body = {
                ...vBankOrder,
                region: vBankOrder.regionId,
                vBank: true,
            };

            if (vBankOrder) {
                const result = await prisma.vBankOrder.update({
                    where: { receipt_id },
                    data: {
                        standBy: false,
                        orderStatusId: 7,
                    },
                });
            }

            next();
        }
        res.json({ success: true });
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};

export const SetTimer = (callbackFn, ms) => {
    console.log("start");
    setTimeout(callbackFn, ms);
};

export const SetIntervalTimer = (fn, callbackFn, interval, ms) => {};

export const GetCommissionList = async () => {
    const list = await prisma.commission.findMany();

    if (!list) throw new Error("수수료 정보를 찾을 수 없습니다.");

    let result = {};

    for (let index = 0; index < list.length; index++) {
        if (list[index].name === "registPoint")
            result = { registPoint: list[index].commission, ...result };
        else if (list[index].name === "recommendationPoint")
            result = { recommendationPoint: list[index].commission, ...result };
        else if (list[index].name === "cardCommission")
            result = { cardCommission: list[index].commission, ...result };
        else if (list[index].name === "tax")
            result = { tax: list[index].commission, ...result };
    }

    return result;
};
