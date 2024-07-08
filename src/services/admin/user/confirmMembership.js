import prisma from "../../../prisma";
import { GetUTCDateTime, setErrorJson, setResponseJson } from "../../../utils";

export const confirmMembership = async (req, res) => {
    const { id } = req.body;

    // console.log("confirmMembership : ", id);
    try {
        const membership = await prisma.user.update({
            where: {
                id,
            },
            data: {
                finalMembershipDate: GetUTCDateTime(),
                membership: true,
                membershipDate: GetUTCDateTime(),
            },
        });

        if (!membership) throw new Error("정회원 설정에 실패하였습니다.");

        res.json(setResponseJson());
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};
