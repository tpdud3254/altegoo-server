import prisma from "../../../prisma";
import { setErrorJson, setResponseJson } from "../../../utils";

export const getMembershipPrice = async (req, res) => {
    try {
        const membershipPrice = await prisma.adminData.findUnique({
            where: { id: 1 },
            select: { membershipPrice: true },
        });

        if (!membershipPrice) throw new Error("금액 조회에 실패하였습니다.");

        res.json(
            setResponseJson({
                membershipPrice,
            })
        );
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};
