import prisma from "../../../prisma";
import { getUserRestInfo, setErrorJson, setResponseJson } from "../../../utils";

const getMembershipUsers = async (req, res) => {
    const {
        name,
        phone,
        gender,
        startDate,
        endDate,
        membershipStartDate,
        membershipEndDate,
        status,
        region,
    } = req.query;
    console.log(req.query);

    const membership = status === "정회원" ? true : null;

    let statusResult = "정상";

    if (membership) {
        statusResult = null;
    } else {
        if (status !== "기사회원") {
            statusResult = status;
        } else if (status === null) {
            statusResult = null;
        }
    }

    try {
        const users = await prisma.user.findMany({
            where: {
                ...(startDate &&
                    endDate && {
                        AND: [
                            { createdAt: { gt: startDate } },
                            { createdAt: { lt: endDate } },
                        ],
                    }),
                ...(membershipStartDate &&
                    membershipEndDate && {
                        AND: [
                            { membershipDate: { gt: membershipStartDate } },
                            { membershipDate: { lt: membershipEndDate } },
                        ],
                    }),
                ...(name && { name }),
                ...(phone && { phone }),
                ...(gender && { gender }),
                ...(statusResult && { status: statusResult }),
                ...(region && {
                    accessedRegion: { contains: region },
                }),
                ...(membership && { membership: true }),
                ...(!membership &&
                    statusResult === "정상" && {
                        membership: false,
                    }),
                ...(true && { userTypeId: 2 }),
            },
            include: {
                userType: true,
                vehicle: true,
                workRegion: true,
                grade: true,
                point: true,
                pointBreakdown: true,
                order: true,
            },
            orderBy: { id: "asc" },
        });

        if (!users) throw new Error("유저 리스트를 불러올 수 없습니다.");

        async function getRecommendUser() {
            const usersList = await Promise.all(
                users.map(async (user, index) => {
                    delete user.password;

                    if (user.recommendUserId) {
                        if (user.recommendUserId !== 1) {
                            const recommendUser = await prisma.user.findUnique({
                                where: { id: user.recommendUserId },
                                select: { name: true, id: true },
                            });

                            users[index] = {
                                recommendUser: recommendUser,
                                ...(await getUserRestInfo(user)),
                                ...users[index],
                            };
                        } else {
                            users[index] = {
                                recommendUser: { id: 1, name: "알테구" },
                                ...(await getUserRestInfo(user)),
                                ...users[index],
                            };
                        }
                    } else {
                        users[index] = {
                            recommendUser: null,
                            ...(await getUserRestInfo(user)),
                            ...users[index],
                        };
                    }
                })
            );
        }

        await getRecommendUser();

        res.json(setResponseJson({ users: users }));
    } catch (error) {
        console.log(error.message);
        res.json(setErrorJson(error.message));
    }
};

export default getMembershipUsers;
