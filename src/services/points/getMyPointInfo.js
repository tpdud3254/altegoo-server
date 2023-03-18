import prisma from "../../prisma";
import { setErrorJson, setResponseJson } from "../../utils";

export const getMyPointInfo = async (req, res) => {
    const id = req.id;

    try {
        const result = await prisma.point.findFirst({
            where: { userId: id },
        });

        console.log(result);

        if (!result) throw new Error("포인트 조회에 실패하였습니다.");

        res.json(setResponseJson({ points: result }));
    } catch (error) {
        console.log(error.message);
        res.json(setErrorJson(error.message));
    }
};
