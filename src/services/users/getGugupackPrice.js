import prisma from "../../prisma";
import { setErrorJson, setResponseJson } from "../../utils";

export const getGugupackPrice = async (req, res) => {
    try {
        const price = await prisma.adminData.findFirst({
            where: { id: 1 },
            select: {
                gugupackPrice: true,
            },
        });

        if (!price) throw new Error("구구팩 요금 조회 실패");

        res.json(
            setResponseJson({
                price,
            })
        );
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};
