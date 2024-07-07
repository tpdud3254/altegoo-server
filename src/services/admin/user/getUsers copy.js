import prisma from "../../../prisma";
import {
    GetUTCDateTime,
    getUserRestInfo,
    setErrorJson,
    setResponseJson,
} from "../../../utils";

const getUsers = async (req, res) => {
    const {
        name,
        phone,
        gender,
        startDate,
        endDate,
        status,
        userTypeId,
        vehicleTypeId,
        workCategoryId,
        gugupackStatus,
        requestAdminId,
        requestAdminPhone,
    } = req.query;
    console.log("requestAdminId : ", requestAdminId);
    try {
        let adminUserid = null;
        if (requestAdminPhone && requestAdminPhone !== "admin") {
            const userId = await prisma.user.findFirst({
                where: {
                    phone: requestAdminPhone,
                },
                select: {
                    id: true,
                },
            });

            adminUserid = userId.id;
        }

        const users = await prisma.user.findMany({
            where: {
                ...(startDate &&
                    endDate && {
                        AND: [
                            { createdAt: { gte: GetUTCDateTime(startDate) } },
                            { createdAt: { lte: GetUTCDateTime(endDate) } },
                        ],
                    }),
                ...(name && { name }),
                ...(phone && { phone: { contains: phone } }),
                ...(gender && { gender }),
                ...(status && { status }),
                ...(userTypeId && { userTypeId: Number(userTypeId) }),
                ...(workCategoryId && {
                    workCategoryId: Number(workCategoryId),
                }),
                // ...(region && {
                //     accessedRegion: { contains: region },
                // }),
                ...(gugupackStatus && {
                    gugupack: gugupackStatus === "member" ? true : false,
                }),
                ...(adminUserid && {
                    OR: [{ recommendUserId: adminUserid }, { id: adminUserid }],
                }),
            },
            include: {
                userType: true,
                vehicle: {
                    include: {
                        type: true,
                        craneType: true,
                        vehicleCraneWeight: true,
                        floor: true,
                        weight: true,
                    },
                },
                workRegion: true,
                grade: true,
                point: true,
                pointBreakdown: true,
                order: true,
            },
            orderBy: { id: "desc" },
        });

        if (!users) throw new Error("유저 리스트를 불러올 수 없습니다.");

        let result = [];

        async function filterWithVehicle() {
            const usersList = await Promise.all(
                users.map(async (user, index) => {
                    if (user.vehicle.length > 0) {
                        if (
                            Number(vehicleTypeId) ===
                            user.vehicle[0].vehicleTypeId
                        )
                            result.push(user);
                    }
                })
            );
        }

        if (vehicleTypeId) {
            filterWithVehicle();
        } else {
            result = users;
        }

        async function getRecommendUser() {
            const usersList = await Promise.all(
                result.map(async (user, index) => {
                    delete user.password;

                    if (user.recommendUserId) {
                        if (user.recommendUserId !== 1) {
                            const recommendUser = await prisma.user.findUnique({
                                where: { id: user.recommendUserId },
                                select: { name: true, id: true },
                            });

                            result[index] = {
                                recommendUser: recommendUser,
                                ...(await getUserRestInfo(user)),
                                ...result[index],
                            };
                        } else {
                            result[index] = {
                                recommendUser: { id: 1, name: "알테구" },
                                ...(await getUserRestInfo(user)),
                                ...result[index],
                            };
                        }
                    } else {
                        result[index] = {
                            recommendUser: null,
                            ...(await getUserRestInfo(user)),
                            ...result[index],
                        };
                    }
                })
            );
        }

        await getRecommendUser();

        // console.log(users);

        res.json(setResponseJson({ users: result }));
    } catch (error) {
        console.log(error.message);
        res.json(setErrorJson(error.message));
    }
};

export default getUsers;
