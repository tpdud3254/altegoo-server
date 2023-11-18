import prisma from "../../../prisma";
import { setErrorJson, setResponseJson } from "../../../utils";
import { GetCurrentDateTime } from "../../utils";

export const chargePoint = async (req, res) => {
    const { pointId, curPoint, point } = req.body;

    const id = req.id;

    try {
        const result = await prisma.point.update({
            where: { id: pointId },
            data: { curPoint: Number(curPoint) + Number(point) },
        });

        console.log("chargePoint result : ", result);

        if (!result) throw new Error("포인트 변경에 실패하였습니다.");

        //포인트 충전 내역
        const pointBreakdown = await prisma.pointBreakdown.create({
            data: {
                content: "포인트 충전",
                type: "충전",
                point: Number(point),
                restPoint: Number(curPoint) + Number(point),
                user: {
                    connect: {
                        id: id,
                    },
                },
                date: GetCurrentDateTime(),
            },
        });

        res.json(setResponseJson({ points: result }));
    } catch (error) {
        console.log(error.message);
        res.json(setErrorJson(error.message));
    }
};
