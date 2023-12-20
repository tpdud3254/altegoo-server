import prisma from "../../../prisma";
import { getUserRestInfo, setErrorJson, setResponseJson } from "../../../utils";

export const modifyPermission = async (req, res) => {
    const { id, url } = req.body;

    console.log(url);
    try {
        const user = await prisma.user.update({
            where: { id },
            data: {
                vehiclePermission: url,
            },
        });

        if (!user)
            throw new Error("화물자동차운송허가증 등록에 실패하였습니다.");

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
