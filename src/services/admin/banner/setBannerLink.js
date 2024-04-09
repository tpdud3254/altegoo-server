import prisma from "../../../prisma";
import { setErrorJson, setResponseJson } from "../../../utils";

export const setBannerLink = async (req, res) => {
    const { id, link } = req.body;

    try {
        const banner = await prisma.banner.update({
            where: { id },
            data: {
                link,
            },
        });

        if (!banner) throw new Error("배너 링크 변경에 실패했습니다.");

        res.json(setResponseJson({ list: banner }));
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};
