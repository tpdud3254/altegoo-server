import prisma from "../../../prisma";
import { getUserRestInfo, setErrorJson, setResponseJson } from "../../../utils";

export const getUserWithPhone = async (req, res) => {
    const { phone } = req.query;
    console.log(req.query);
    try {
        const user = await prisma.user.findUnique({
            where: {
                phone: phone,
            },
            include: {
                userType: true,
                vehicle: {
                    include: {
                        type: true,
                        floor: true,
                        weight: true,
                    },
                },
                workRegion: true,
                grade: true,
                point: true,
                pointBreakdown: true,
                order: true,
            },
        });

        if (!user) throw new Error("유저 리스트를 불러올 수 없습니다.");

        delete user.password;

        res.json(setResponseJson({ user: user }));
    } catch (error) {
        console.log(error.message);
        res.json(setErrorJson(error.message));
    }
};
