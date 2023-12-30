import prisma from "../../../prisma";
import { setErrorJson, setResponseJson } from "../../../utils";

export const deleteOrder = async (req, res) => {
    const { orderId } = req.body;

    console.log(orderId);
    try {
        const deletedOrder = await prisma.order.delete({
            where: {
                id: orderId,
            },
        });
        if (!deletedOrder) throw new Error("삭제 불가");
        res.json(setResponseJson({ order: deletedOrder }));
    } catch (error) {
        console.log(error.message);
        res.json(setErrorJson(error.message));
    }
};
