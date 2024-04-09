import prisma from "../../../prisma";
import { setErrorJson, setResponseJson } from "../../../utils";

export const setBannerImage = async (req, res) => {
    const { id, url } = req.body;

    console.log(url);
    try {
        const banner = await prisma.banner.update({
            where: { id },
            data: {
                imageUrl: url,
            },
        });

        if (!banner) throw new Error("배너 등록에 실패하였습니다.");

        res.json(
            setResponseJson({
                list: banner,
            })
        );
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};
