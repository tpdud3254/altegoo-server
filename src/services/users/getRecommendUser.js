import prisma from "../../prisma";
import { setErrorJson, setResponseJson } from "../../utils";

export const getRecommendUser = async (req, res) => {
    const id = req.id;

    console.log(id);
    try {
        const recommend = await prisma.user.findMany({
            where: { recommendUserId: id },
            // take: 5,
            // skip: lastUserId ? 1 : 0,
            // ...(lastUserId && { cursor: { id: lastUserId } }),
            //TODO: pagination
        });

        if (!recommend) throw new Error("추천인 조회에 실패했습니다.");

        // console.log(workList);
        res.json(setResponseJson({ list: recommend }));
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};
