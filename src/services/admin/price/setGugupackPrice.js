import prisma from "../../../prisma";
import { setErrorJson, setResponseJson } from "../../../utils";

export const setGugupackPrice = async (req, res) => {
    const { price } = req.body;

    console.log(price);
    try {
        const gugupakcPrice = await prisma.adminData.update({
            where: { id: 1 },
            data: {
                gugupackPrice: Number(price),
            },
            select: {
                gugupackPrice: true,
            },
        });

        if (!gugupakcPrice)
            throw new Error("구구팩 금액 수정에 실패하였습니다.");

        res.json(
            setResponseJson({
                price: gugupakcPrice,
            })
        );
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};
