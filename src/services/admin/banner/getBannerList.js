import prisma from "../../../prisma";
import { setErrorJson, setResponseJson } from "../../../utils";

export const getBannerList = async (req, res) => {
    try {
        const list = await prisma.banner.findMany({
            orderBy: {
                id: "asc",
            },
        });

        if (!list) throw new Error("배너 불러오기에 실패하였습니다.");

        res.json(
            setResponseJson({
                list,
            })
        );
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};
