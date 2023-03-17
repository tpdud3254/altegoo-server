import prisma from "./prisma";
import jwt from "jsonwebtoken";
import AWS from "aws-sdk";
import multer from "multer";

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
