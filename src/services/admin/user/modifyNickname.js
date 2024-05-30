import prisma from "../../../prisma";
import { getUserRestInfo, setErrorJson, setResponseJson } from "../../../utils";

export const modifyNickname = async (req, res) => {
    const { id, nickname } = req.body;

    console.log(nickname);
    try {
        const user = await prisma.user.update({
            where: { id },
            data: {
                nickname,
            },
        });

        if (!user) throw new Error("별칭 수정에 실패하였습니다.");

        const restInfo = await getUserRestInfo(user);

        res.json(
            setResponseJson({
                user: {
                    ...user,
                    ...restInfo,
                },
            })
        );
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};
