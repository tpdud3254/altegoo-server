import prisma from "../../../prisma";
import {
    deletePushForWorks,
    setErrorJson,
    setResponseJson,
} from "../../../utils";

export const cancelOrder = async (req, res) => {
    const { orderId } = req.body;

    try {
        const work = await prisma.order.update({
            where: {
                id: orderId,
            },
            data: {
                acceptUser: null,
                status: {
                    connect: {
                        id: 1,
                    },
                },
            },
        });

        if (!work) throw new Error("작업상태 변경에 실패했습니다.");

        deletePushForWorks(work);
        res.json(setResponseJson({ order: work }));
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};
