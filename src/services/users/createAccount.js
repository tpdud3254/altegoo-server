import bcrypt from "bcrypt";
import prisma from "../../prisma";
import {
    craeteUserId,
    getUserRestInfo,
    setErrorJson,
    setResponseJson,
} from "../../utils";

export const createAccount = async (req, res) => {
    const {
        userType,
        name,
        phone,
        password,
        birth,
        gender,
        sms,
        license,
        recommendUserId,
        companyName,
        companyPersonName,
        workCategory,
        vehicle,
        vehiclePermission,
        workRegion,
        accessedRegion,
        status,
        grade,
    } = req.body;

    console.log(req.body);

    const hashedPassword = await bcrypt.hash(password, 10);

    //TODO: 아바타 이미지 저장

    let user;

    try {
        if (userType === "NORMAL") {
            //일반회원
            user = await prisma.user.create({
                data: {
                    userType: {
                        connect: { id: 1 },
                    },
                    name,
                    phone,
                    password: hashedPassword,
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
        } else if (userType === "DRIVER") {
            //기사회원
            const regionArr = [];

            workRegion.map((region) => {
                const newObj = { id: region };

                regionArr.push(newObj);
            });

            const vehicleArr = [];

            async function setVehicle() {
                const vehicleResult = await Promise.all(
                    vehicle.map(async (vehicle) => {
                        const result = await prisma.vehicle.create({
                            data: {
                                number: vehicle.number,
                                type: {
                                    connect: {
                                        id: vehicle.type,
                                    },
                                },
                                ...(vehicle.weight && {
                                    weight: {
                                        connect: {
                                            id: vehicle.weight,
                                        },
                                    },
                                }),
                                ...(vehicle.floor && {
                                    floor: {
                                        connect: {
                                            id: vehicle.floor,
                                        },
                                    },
                                }),
                            },
                        });

                        if (result) {
                            const newObj = { id: result.id };

                            vehicleArr.push(newObj);
                        }
                    })
                );
            }

            if (vehicle && vehicle.length > 0) await setVehicle();

            user = await prisma.user.create({
                data: {
                    userType: {
                        connect: { id: 2 },
                    },
                    name,
                    phone,
                    password: hashedPassword,
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
                    license,
                    vehiclePermission,
                    ...(vehicleArr.length > 0 && {
                        vehicle: {
                            connect: vehicleArr,
                        },
                    }),
                    recommendUserId,
                    workRegion: {
                        connect: regionArr,
                    },
                },
            });

            //기사 회원 가입 시 10000포인트 적립
            const point = await prisma.point.update({
                where: { userId: user.id },
                data: { curPoint: 10000 },
            });

            const firstCreateUser = await prisma.pointBreakdown.create({
                data: {
                    content: "첫 가입 포인트 적립",
                    type: "적립",
                    point: 10000,
                    restPoint: 10000,
                    user: {
                        connect: {
                            id: user.id,
                        },
                    },
                },
            });
        } else {
            //기업회원
            user = await prisma.user.create({
                data: {
                    userType: {
                        connect: { id: 3 },
                    },
                    name,
                    phone,
                    password: hashedPassword,
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
                    license,
                    companyName,
                    companyPersonName,
                    workCategory: {
                        connect: { id: workCategory },
                    },
                    recommendUserId,
                },
            });
        }

        if (!user) throw new Error("회원가입에 실패하였습니다.");

        // const userId = craeteUserId(userCode, user.id);

        // const account = await prisma.user.update({
        //     where: { id: user.id },
        //     data: {
        //         userId,
        //     },
        // });

        // if (!account) throw new Error("회원가입에 실패하였습니다.");
        delete user.password;

        const userData = {
            ...(await getUserRestInfo(user)),
            ...user,
        };

        res.json(setResponseJson({ user: userData }));
    } catch (error) {
        console.log(error);
        res.json(setErrorJson(error.message));
    }
};
