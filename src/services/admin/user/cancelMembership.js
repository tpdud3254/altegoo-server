import prisma from "../../../prisma";
import { setErrorJson, setResponseJson } from "../../../utils";

export const cancelMembership = async (req, res) => {
    const { id } = req.body;

    console.log("cancelMembership : ", id);
    try {
        const now = new Date();
        const membership = await prisma.user.update({
            where: {
                id,
            },
            data: {
                membership: false,
                withdrawalMembershipDate: now,
            },
        });

        if (!membership) throw new Error("정회원 취소에 실패하였습니다.");

        res.json(setResponseJson());
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};
