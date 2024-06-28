import prisma from "../../../prisma";
import { setErrorJson, setResponseJson } from "../../../utils";

const getVehicleCraneWeight = async (req, res) => {
    try {
        const weight = await prisma.vehicleCraneWeight.findMany({
            orderBy: { id: "asc" },
        });

        console.log(weight);
        if (!weight) throw new Error("정보를 불러올 수 없습니다.");

        console.log("weight : ", weight);

        res.json(setResponseJson({ vehicleWeight: weight }));
    } catch (error) {
        console.log(error.message);
        res.json(setErrorJson(error.message));
    }
};

export default getVehicleCraneWeight;
