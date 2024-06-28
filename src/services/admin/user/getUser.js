import prisma from "../../../prisma";
import { getUserRestInfo, setErrorJson, setResponseJson } from "../../../utils";

const getUser = async (req, res) => {
    const { id } = req.query;
    console.log(req.query);
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(id),
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
        });

        if (!user) throw new Error("유저 리스트를 불러올 수 없습니다.");

        delete user.password;

        const recommend = await prisma.user.findMany({
            where: { recommendUserId: Number(id) },
            include: { point: true, workCategory: true },
        });

        let list = null;
        if (user.recommendUserId) {
            if (user.recommendUserId !== 1) {
                const recommendUser = await prisma.user.findUnique({
                    where: { id: Number(user.recommendUserId) },
                    include: { point: true, workCategory: true },
                });

                list = {
                    recommendUserList:
                        !recommend || recommend.length === 0 ? [] : recommend,
                    myRecommendUser:
                        !recommendUser || recommendUser.length === 0
                            ? []
                            : [recommendUser],
                    ...(await getUserRestInfo(user)),
                    ...user,
                };
            } else {
                list = {
                    recommendUserList:
                        !recommend || recommend.length === 0 ? [] : recommend,
                    myRecommendUser: [{ id: 1, name: "알테구" }],
                    ...(await getUserRestInfo(user)),
                    ...user,
                };
            }
        } else {
            list = {
                recommendUserList:
                    !recommend || recommend.length === 0 ? [] : recommend,
                myRecommendUser: [{ id: 1, name: "알테구" }],
                ...(await getUserRestInfo(user)),
                ...user,
            };
        }

        res.json(setResponseJson({ users: list }));
    } catch (error) {
        console.log(error.message);
        res.json(setErrorJson(error.message));
    }
};

export default getUser;
