import prisma from "../../prisma";
import { getUserRestInfo, setErrorJson, setResponseJson } from "../../utils";

export const searchRecommendUser = async (req, res) => {
    const { id } = req.query;

    console.log(id);
    try {
        const recommend = await prisma.user.findMany({
            where: {
                recommendUserId: Number(id),
                NOT: {
                    userTypeId: 1,
                },
            },
            orderBy: { id: "desc" },
            // take: 5,
            // skip: lastUserId ? 1 : 0,
            // ...(lastUserId && { cursor: { id: lastUserId } }),
            //TODO: pagination
        });
        // .then((user) => {});

        console.log("recommend : ", recommend);
        if (!recommend) throw new Error("추천인 조회에 실패했습니다.");

        async function getUserList() {
            const usersList = await Promise.all(
                recommend.map(async (user, index) => {
                    delete user.password;

                    const orderCount = await prisma.order.count({
                        where: {
                            ...(user.userTypeId === 2 && {
                                acceptUser: user.id,
                            }),
                            ...(user.userTypeId === 3 && {
                                userId: user.id,
                            }),
                            OR: [{ orderStatusId: 5 }, { orderStatusId: 6 }],
                        },
                    });

                    recommend[index] = {
                        ...(await getUserRestInfo(user)),
                        ...{ orderCount },
                        ...recommend[index],
                    };
                })
            );
        }

        await getUserList();

        res.json(setResponseJson({ list: recommend }));
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};
