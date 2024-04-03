import prisma from "../../prisma";
import { getUserRestInfo, setErrorJson, setResponseJson } from "../../utils";

export const joinGugupack = async (req, res) => {
    const { id } = req.body;

    try {
        const user = await prisma.user.update({
            where: { id },
            data: {
                gugupack: true,
            },
        });

        if (!user) throw new Error("구구팩 가입에 실패하였습니다.");

        delete user.password;

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
