import prisma from "../../prisma";
import { setErrorJson, setResponseJson } from "../../utils";

export const getSpecialUserCount = async (req, res) => {
    try {
        const userCount = await prisma.user.count({
            where: {
                OR: [
                    { userType: { type: "COMPANY" } },
                    { userType: { type: "ORDINARY" } },
                ],
            },
        });

        if (!userCount) throw new Error("유저 수 조회에 실패하였습니다.");

        res.json(setResponseJson({ count: userCount }));
    } catch (error) {
        console.log(error.message);
        res.json(setErrorJson(error.message));
    }
};
