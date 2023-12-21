import prisma from "../../../prisma";
import {
    GetPlusDateTime,
    getUserRestInfo,
    setErrorJson,
    setResponseJson,
} from "../../../utils";

const getWithdrawalList = async (req, res) => {
    const { startDate, endDate, name, userId, phone } = req.query;
    console.log(req.query);
    try {
        const list = await prisma.pointBreakdown.findMany({
            where: {
                NOT: { userId: null },
                ...(startDate &&
                    endDate && {
                        AND: [
                            { date: { gt: GetPlusDateTime(startDate) } },
                            { date: { lt: GetPlusDateTime(endDate) } },
                        ],
                    }),
                ...(name && { user: { name } }),
                ...(userId && { user: { id: Number(userId) } }),
                ...(phone && { user: { phone } }),
            },
            include: {
                user: {
                    include: {
                        userType: true,
                        workCategory: true,
                        point: true,
                    },
                },
            },
            orderBy: { id: "desc" },
        });
        // const users = await prisma.user.findMany({
        //     where: {
        //         ...(startDate &&
        //             endDate && {
        //                 AND: [
        //                     { createdAt: { gt: GetPlusDateTime(startDate) } },
        //                     { createdAt: { lt: GetPlusDateTime(endDate) } },
        //                 ],
        //             }),
        //         ...(name && { name }),
        //         ...(phone && { phone }),
        //         ...(gender && { gender }),
        //         ...(status && { status }),
        //         ...(userTypeId && { userTypeId: Number(userTypeId) }),
        //         ...(workCategoryId && {
        //             workCategoryId: Number(workCategoryId),
        //         }),
        //         ...(region && {
        //             accessedRegion: { contains: region },
        //         }),
        //     },
        //     include: {
        //         userType: true,
        //         vehicle: true,
        //         workRegion: true,
        //         grade: true,
        //         point: true,
        //         pointBreakdown: true,
        //         order: true,
        //     },
        //     orderBy: { id: "asc" },
        // });

        // if (!users) throw new Error("유저 리스트를 불러올 수 없습니다.");

        // async function getRecommendUser() {
        //     const usersList = await Promise.all(
        //         users.map(async (user, index) => {
        //             delete user.password;

        //             if (user.recommendUserId) {
        //                 if (user.recommendUserId !== 1) {
        //                     const recommendUser = await prisma.user.findUnique({
        //                         where: { id: user.recommendUserId },
        //                         select: { name: true, id: true },
        //                     });

        //                     users[index] = {
        //                         recommendUser: recommendUser,
        //                         ...(await getUserRestInfo(user)),
        //                         ...users[index],
        //                     };
        //                 } else {
        //                     users[index] = {
        //                         recommendUser: { id: 1, name: "알테구" },
        //                         ...(await getUserRestInfo(user)),
        //                         ...users[index],
        //                     };
        //                 }
        //             } else {
        //                 users[index] = {
        //                     recommendUser: null,
        //                     ...(await getUserRestInfo(user)),
        //                     ...users[index],
        //                 };
        //             }
        //         })
        //     );
        // }

        // await getRecommendUser();

        // console.log(users);

        res.json(setResponseJson({ list: list }));
    } catch (error) {
        console.log(error.message);
        res.json(setErrorJson(error.message));
    }
};

export default getWithdrawalList;
