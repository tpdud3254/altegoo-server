import prisma from "../../prisma";
import { setErrorJson, setResponseJson } from "../../utils";

const getKakaoUrl = async (req, res) => {
    try {
        const url = await prisma.adminData.findUnique({
            where: {
                id: 1,
            },
            select: {
                kakaoUrl: true,
            },
        });

        res.json(setResponseJson({ url: url.kakaoUrl }));
    } catch (error) {
        console.log(error.message);
        res.json(setErrorJson(error.message));
    }
};

export default getKakaoUrl;
