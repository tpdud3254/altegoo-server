import prisma from "../../../prisma";
import { setErrorJson, setResponseJson } from "../../../utils";

export const getPopup = async (req, res) => {
    try {
        const popup = await prisma.adminData.findMany({
            where: {
                id: 1,
            },
            select: { popupUrl: true },
        });

        if (!popup) throw new Error("팝업 이미지 불러오기에 실패하였습니다.");

        res.json(
            setResponseJson({
                popup,
            })
        );
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};
