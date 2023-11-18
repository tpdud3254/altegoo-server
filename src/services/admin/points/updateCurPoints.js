import prisma from "../../../prisma";
import { setErrorJson, setResponseJson } from "../../../utils";

export const updateCurPoints = async (req, res) => {
    const { pointId, points } = req.body;

    try {
        const result = await prisma.point.update({
            where: { id: pointId },
            data: { curPoint: points },
        });

        console.log(result);

        if (!result) throw new Error("포인트 변경에 실패하였습니다.");

        res.json(setResponseJson({ points: result }));
    } catch (error) {
        console.log(error.message);
        res.json(setErrorJson(error.message));
    }
};
