import prisma from "../../../prisma";
import { setErrorJson, setResponseJson } from "../../../utils";

const getVehleFloor = async (req, res) => {
    try {
        const floor = await prisma.vehicleFloor.findMany({
            orderBy: { id: "asc" },
        });

        console.log(floor);
        if (!floor) throw new Error("정보를 불러올 수 없습니다.");

        console.log("floor : ", floor);

        res.json(setResponseJson({ vehicleFloor: floor }));
    } catch (error) {
        console.log(error.message);
        res.json(setErrorJson(error.message));
    }
};

export default getVehleFloor;
