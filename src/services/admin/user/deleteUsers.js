import prisma from "../../../prisma";
import { setErrorJson, setResponseJson } from "../../../utils";

export const deleteUsers = async (req, res) => {
    const { userList } = req.body;

    console.log(userList);
    try {
        let result = [];
        async function deleteAll() {
            const deleteResult = await Promise.all(
                userList.map(async (value, index) => {
                    if (value.pointId) {
                        const point = await prisma.point.delete({
                            where: { id: Number(value.pointId) },
                        });
                    }

                    const order = await prisma.order.deleteMany({
                        where: { userId: Number(value.userId) },
                    });

                    const recommend = await prisma.user.updateMany({
                        where: { recommendUserId: Number(value.userId) },
                        data: {
                            recommendUserId: 1,
                        },
                    });
                    const user = await prisma.user.delete({
                        where: { id: Number(value.userId) },
                    });

                    result.push(user);
                })
            );
        }

        await deleteAll();

        console.log(result);
        if (!result) throw new Error("유저 삭제에 실패하였습니다.");

        res.json(setResponseJson({ user: result }));
    } catch (error) {
        console.log(error.message);
        res.json(setErrorJson(error.message));
    }
};
