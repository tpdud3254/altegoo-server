import bcrypt from "bcrypt";
import prisma from "../../prisma";
import { craeteUserId } from "../../utils";

export const createAccount = async (req, res) => {
    const {
        userCode,
        userType,
        userName,
        name,
        password,
        phone,
        birth,
        license,
        vehicleNumber,
        vehicleWeight,
        vehicleType,
        recommendUserId,
        gender,
        status,
        workRegion,
        accessedRegion,
        sms,
        grade,
    } = req.body;

    console.log(req.body);

    const hashedPassword = await bcrypt.hash(password, 10);

    // TODO:license => 이미지 저장

    let user;

    try {
        if (userCode === "P") {
            //일반회원
            user = await prisma.user.create({
                data: {
                    userType: {
                        connect: { id: userType },
                    },
                    userName,
                    name,
                    password: hashedPassword,
                    phone,
                    birth,
                    gender,
                    status,
                    accessedRegion,
                    sms,
                    grade: {
                        connect: {
                            id: grade,
                        },
                    },
                    point: {
                        create: {
                            curPoint: 0,
                        },
                    },
                },
            });
        } else if (userCode === "S") {
            const regionArr = [];

            workRegion.map((region) => {
                const newObj = { id: region };

                regionArr.push(newObj);
            });

            //기사회원
            user = await prisma.user.create({
                data: {
                    userType: {
                        connect: { id: userType },
                    },
                    userName,
                    name,
                    password: hashedPassword,
                    phone,
                    birth,
                    license,
                    vehicleNumber,
                    vehicleWeight: {
                        connect: {
                            id: vehicleWeight,
                        },
                    },
                    vehicleType: {
                        connect: {
                            id: vehicleType,
                        },
                    },
                    recommendUserId,
                    gender,
                    status,
                    workRegion: {
                        connect: regionArr,
                    },
                    accessedRegion,
                    sms,
                    grade: {
                        connect: {
                            id: grade,
                        },
                    },
                    point: {
                        create: {
                            curPoint: 0,
                        },
                    },
                },
            });
        } else {
            //기업회원
            const regionArr = [];

            workRegion.map((region) => {
                const newObj = { id: region };

                regionArr.push(newObj);
            });

            //기사회원
            user = await prisma.user.create({
                data: {
                    userType: {
                        connect: { id: userType },
                    },
                    userName,
                    name,
                    password: hashedPassword,
                    phone,
                    birth,
                    license,
                    vehicleNumber,
                    recommendUserId,
                    gender,
                    status,
                    workRegion: {
                        connect: regionArr,
                    },
                    accessedRegion,
                    sms,
                    grade: {
                        connect: {
                            id: grade,
                        },
                    },
                    point: {
                        create: {
                            curPoint: 0,
                        },
                    },
                },
            });
        }

        if (user) {
            const userId = craeteUserId(userCode, user.id);

            const account = await prisma.user.update({
                where: { id: user.id },
                data: {
                    userId,
                },
            });

            if (account) {
                delete account.password;
                res.status(200).json({ result: "VALID", data: account });
            } else {
                res.status(400).json({
                    result: "INVALID: CREATE USERID",
                    msg: "회원가입에 실패하였습니다.",
                });
            }
        } else {
            res.status(400).json({
                result: "INVALID: CREATE ACCOUNT",
                msg: "회원가입에 실패하였습니다.",
            });
        }
    } catch (error) {
        res.status(400).json({
            result: "INVALID: ERROR",
            error,
            msg: "회원가입에 실패하였습니다.",
        });
    }
};
