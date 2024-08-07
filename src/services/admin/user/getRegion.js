import prisma from "../../../prisma";
import {
    GetUTCDateTime,
    getUserRestInfo,
    setErrorJson,
    setResponseJson,
} from "../../../utils";

const getRegion = async (req, res) => {
    try {
        const regoin = await prisma.region.findMany({
            orderBy: {
                id: "asc",
            },
        });
        res.json(setResponseJson({ regoin: regoin }));
    } catch (error) {
        console.log(error.message);
        res.json(setErrorJson(error.message));
    }
};

export default getRegion;
