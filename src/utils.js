import prisma from "./prisma";
import jwt from "jsonwebtoken";
import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";

AWS.config.update({
  region: "ap-northeast-2",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const s3 = new AWS.S3();

const allowedExtensions = [".png", ".jpg", "jpeg", ".bmp"];

export const uploader = multer({
  storage: multer.memoryStorage(),
  limits: { fieldSize: 25 * 1024 * 1024 },
});

// export const imageUploader = multer({
//     storage: multerS3({
//       s3: s3,
//       bucket: "altegoo-bucket",
//       key: (req, file, callback) => {
//         console.log("file : ", file);
//         const uploadDirectory = req.query.directory ?? "";
//         const extension = path.extname(file.originalname);
//         if (!allowedExtensions.includes(extension)) {
//           return callback(new Error("wrong extension"));
//         }
//         callback(null, `${uploadDirectory}/${Date.now()}_${file.originalname}`);
//       },
//       acl: "public-read-white",
//     }),
//   });

export const existUser = (phone) =>
  prisma.user.findUnique({
    where: { phone },
  });

export const craeteUserId = (code, id) => {
  return code + String(id).padStart(5, "0");
};

export const auth = async (req, res, next) => {
  const token = req.headers.auth;

  console.log(token);

  if (!token) {
    res.status(400).json({
      result: "INVALID: TOKEN NOT FOUND",
      msg: "사용자를 찾을 수 없습니다.",
    });
  }

  try {
    const { id } = jwt.verify(token, process.env.SECRET_KEY);

    if (!id) {
      res.status(400).json({
        result: "INVALID: TOKEN NOT FOUND",
        msg: "사용자를 찾을 수 없습니다.",
      });
    }
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (user) {
      req.id = user.id;
      next();
    } else {
      res.status(400).json({
        result: "INVALID: USER NOT FOUND",
        msg: "사용자를 찾을 수 없습니다.",
      });
    }
  } catch (error) {
    res.status(400).json({
      result: "INVALID: FAIL",
      error,
      msg: "사용자를 찾을 수 없습니다.",
    });
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
