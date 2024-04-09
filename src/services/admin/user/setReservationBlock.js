import prisma from "../../../prisma";
import { setErrorJson, setResponseJson } from "../../../utils";

export const setReservationBlock = async (req, res) => {
    const { id, blockStatus } = req.body;

    console.log(id);
    try {
        const user = await prisma.user.update({
            where: {
                id,
            },
            data: {
                reservationBlock: Boolean(blockStatus),
            },
        });

        if (!user) throw new Error("임시중지 변경에 실패하였습니다.");

        res.json(
            setResponseJson({
                user: user,
            })
        );
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};
