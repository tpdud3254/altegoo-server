import { setErrorJson, setResponseJson } from "../../utils";
import prisma from "../../prisma";

export const checkAccount = async (req, res) => {
    const { id } = req.body;

    console.log(req.body);

    try {
        const user = await prisma.admin.findUnique({
            where: {
                userId: id,
            },
        });

        console.log(user);
        if (!user) res.json(setResponseJson({ exist: false }));
        else res.json(setResponseJson({ exist: true }));
    } catch (error) {
        console.log(error);
        res.json(setErrorJson(error.message));
    }
};
