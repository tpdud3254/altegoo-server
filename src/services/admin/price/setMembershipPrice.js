import prisma from "../../../prisma";
import { setErrorJson, setResponseJson } from "../../../utils";

export const setMembershipPrice = async (req, res) => {
    const { price } = req.body;

    console.log(price);
    try {
        const membershipcPrice = await prisma.adminData.update({
            where: { id: 1 },
            data: {
                membershipPrice: Number(price),
            },
            select: {
                membershipPrice: true,
            },
        });

        if (!membershipcPrice)
            throw new Error("정회원 금액 수정에 실패하였습니다.");

        res.json(
            setResponseJson({
                price: membershipcPrice,
            })
        );
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};
