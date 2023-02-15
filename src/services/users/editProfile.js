import prisma from "../../prisma";
import { getUserRestInfo } from "../../utils";

export const editProfile = async (req, res) => {
    const {
        userType,
        name,
        license,
        vehicleNumber,
        vehicleWeight,
        vehicleType,
        workRegion,
        sms,
        avatar,
        greeting,
    } = req.body;

    const id = req.id;

    console.log(id);
    console.log(req.body);

    const regionArr = [];

    if (workRegion) {
        workRegion.map((region) => {
            const newObj = { id: region };

            regionArr.push(newObj);
        });
    }

    const prevRegion = await prisma.user.findMany({
        where: { id },
        select: {
            workRegion: {
                select: {
                    id: true,
                },
            },
        },
    });

    //TODO: 라이센스 이미지 저장
    //TODO: 아바타 이미지 저장

    try {
        const user = await prisma.user.update({
            where: { id },
            data: {
                userType: {
                    connect: { id: userType },
                },
                name,
                sms,
                greeting,
                ...(license && {
                    license,
                }),
                ...(vehicleNumber && {
                    vehicleNumber,
                }),
                ...(vehicleWeight && {
                    vehicleWeight: {
                        connect: {
                            id: vehicleWeight,
                        },
                    },
                }),
                ...(vehicleType && {
                    vehicleType: {
                        connect: {
                            id: vehicleType,
                        },
                    },
                }),
                ...(regionArr.length > 0 && {
                    workRegion: {
                        disconnect: prevRegion[0].workRegion,
                        connect: regionArr,
                    },
                }),
                ...(avatar && {
                    avatar,
                }),
            },
        });

        if (user) {
            delete user.password;

            const restInfo = await getUserRestInfo(user);
            delete restInfo.workRegion;

            res.status(200).json({
                result: "VALID",
                data: {
                    user: {
                        ...user,
                        ...restInfo,
                        ...{ workRegion: workRegion },
                    },
                },
            });
        } else {
            res.status(400).json({
                result: "INVALID: FAIL TO EDIT PROFILE",
                msg: "프로필 변경에 실패하였습니다.",
            });
        }
    } catch (error) {
        res.status(400).json({
            result: "INVALID: ERROR",
            error,
            msg: "프로필 변경에 실패하였습니다.",
        });
    }
};
