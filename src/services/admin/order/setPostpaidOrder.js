import prisma from "../../../prisma";
import { setErrorJson, setResponseJson } from "../../../utils";

const setPostpaidOrder = async (req, res) => {
    const { orderId } = req.body;

    try {
        const order = await prisma.order.update({
            where: { id: orderId },
            data: { isCalculated: true },
        });

        if (!order) throw new Error("포인트 분배 실패");

        res.json(setResponseJson({ order }));
    } catch (error) {
        console.log(error.message);
        res.json(setErrorJson(error.message));
    }
};

export default setPostpaidOrder;
