import prisma from "../../prisma";
import { setErrorJson, setResponseJson } from "../../utils";

export const getDirverCount = async (req, res) => {
    try {
        const userCount = await prisma.user.count({
            where: {
                OR: [{ userTypeId: 2 }],
            },
        });

        if (!userCount) throw new Error("유저 수 조회에 실패하였습니다.");

        res.json(setResponseJson({ count: userCount }));
    } catch (error) {
        console.log(error.message);
        res.json(setErrorJson(error.message));
    }
};
