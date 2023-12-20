import prisma from "../../../prisma";
import { setErrorJson, setResponseJson } from "../../../utils";

export const subtractPoints = async (req, res) => {
    const { pointList } = req.body;

    try {
        let result = [];
        async function updatePoint() {
            const point = await Promise.all(
                pointList.map(async (value, index) => {
                    const point = await prisma.point.update({
                        where: { id: value.id },
                        data: {
                            curPoint: Number(value.point),
                        },
                    });

                    result.push(point);
                })
            );
        }

        await updatePoint();

        console.log(result);

        if (!result) throw new Error("포인트 변경에 실패하였습니다.");

        res.json(setResponseJson({ points: result }));
    } catch (error) {
        console.log(error.message);
        res.json(setErrorJson(error.message));
    }
};
