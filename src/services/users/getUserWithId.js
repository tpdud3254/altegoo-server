import prisma from "../../prisma";
import { existUser, setErrorJson, setResponseJson } from "../../utils";

export const getUserWithId = async (req, res) => {
    const { id } = req.query;

    //TODO 예외처리 보강강
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            include: { vehicle: true },
        });
        res.json(setResponseJson({ user: user }));
    } catch (error) {
        console.log(error.message);
        res.json(setErrorJson(error.message));
    }
};
