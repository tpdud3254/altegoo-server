import prisma from "../../../prisma";
import { setErrorJson, setResponseJson } from "../../../utils";

export const setPopupImage = async (req, res) => {
    const { url } = req.body;

    console.log(url);
    try {
        const popup = await prisma.adminData.update({
            where: { id: 1 },
            data: {
                popupUrl: url,
            },
        });

        if (!popup) throw new Error("배너 등록에 실패하였습니다.");

        res.json(
            setResponseJson({
                popup,
            })
        );
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};
