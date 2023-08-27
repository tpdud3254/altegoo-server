import prisma from "../../prisma";
import { deletePushForWorks, setErrorJson, setResponseJson } from "../../utils";

export const deleteOrder = async (req, res) => {
    const id = req.id;
    const { orderId, userId } = req.body;

    try {
        if (id !== userId)
            throw new Error("본인이 등록한 작업만 취소 가능합니다.");

        const order = await prisma.order.delete({ where: { id: orderId } });

        console.log(order);

        if (!order) throw new Error("오더 취소 요청에 실패했습니다.");

        deletePushForWorks(order); //TODO: 확인하기

        res.json(setResponseJson({ order }));
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};
