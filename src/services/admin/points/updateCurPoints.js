import prisma from "../../../prisma";
import { GetUTCDateTime, setErrorJson, setResponseJson } from "../../../utils";

export const updateCurPoints = async (req, res) => {
    const { pointId, points, curPoint, type, content } = req.body;

    console.log(pointId, points, curPoint, type, content);
    try {
        const calc =
            type === "charge" || type === "add"
                ? curPoint + points
                : curPoint - points;

        if (calc < 0) throw new Error("포인트 변경에 실패하였습니다.");

        let typeText = "";

        switch (type) {
            case "charge":
                typeText = "충전";
                break;
            case "withdrawal":
                typeText = "출금";
                break;
            case "add":
                typeText = "지급";
                break;
            case "subtract":
                typeText = "차감";
                break;
            default:
                break;
        }

        if (typeText.length === 0)
            throw new Error("포인트 변경에 실패하였습니다.");

        //포인트 변경
        const result = await prisma.point.update({
            where: { id: pointId },
            data: {
                curPoint: Number(calc),
            },
        });

        console.log(result);

        if (!result) throw new Error("포인트 변경에 실패하였습니다.");

        //포인트 출금 내역
        const pointBreakdown = await prisma.pointBreakdown.create({
            data: {
                content,
                type: typeText,
                point: Number(points),
                restPoint: calc,
                user: {
                    connect: {
                        id: result.userId,
                    },
                },
                date: GetUTCDateTime(),
            },
        });

        res.json(setResponseJson({ points: result, pointBreakdown }));
    } catch (error) {
        console.log(error.message);
        res.json(setErrorJson(error.message));
    }
};
