import prisma from "../../../prisma";
import { GetPlusDateTime, setErrorJson, setResponseJson } from "../../../utils";

export const updateOrder = async (req, res) => {
    const {
        orderId,
        registUser,
        workDateTime,
        address1,
        detailAddress1,
        simpleAddress1,
        address2,
        detailAddress2,
        simpleAddress2,
        orderType,
        direction,
        volume,
        time,
        quantity,
        floor,
        downFloor,
        upFloor,
        skyTime,
        skyFloor,
        orderStatus,
        price,
        memo,
        directPhone,
        latitude,
        longitude,
    } = req.body;

    console.log(req.body);
    try {
        let phone = null;

        if (registUser) {
            const userPhone = await prisma.user.findUnique({
                where: { id: registUser },
                select: { phone: true },
            });
            phone = userPhone.phone;
        }

        let totalPrice = null;
        let tax = null;
        let registPoint = null;
        let finalPrice = null;
        let recommendationPoint = null;
        let orderPoint = null;

        if (price) {
            totalPrice = price;
            tax = totalPrice * 0.1;
            registPoint = price * 0.18;
            finalPrice = totalPrice + tax;
            recommendationPoint = price * 0.02;
            orderPoint = Math.floor(price * 1.078 - price * 0.02 - registPoint);
        }

        const updatedOrder = await prisma.order.update({
            where: {
                id: orderId,
            },
            data: {
                ...(registUser && {
                    registUser: { connect: { id: registUser } },
                }),
                ...(phone && {
                    phone,
                }),
                ...(workDateTime && {
                    dateTime: GetPlusDateTime(workDateTime),
                }),
                ...(address1 && { address1 }),
                ...(detailAddress1 && { detailAddress1 }),
                ...(simpleAddress1 && { simpleAddress1 }),
                ...(address2 && { address2 }),
                ...(detailAddress2 && { detailAddress2 }),
                ...(simpleAddress2 && { simpleAddress2 }),
                ...(latitude && { latitude }),
                ...(longitude && { longitude }),
                ...(orderType && { vehicleType: orderType }),
                ...(direction && { direction }),
                ...(floor && { floor }),
                ...(downFloor && { downFloor }),
                ...(upFloor && { upFloor }),
                ...(volume && { volume }),
                ...(time && { time }),
                ...(quantity && { quantity }),
                ...(skyTime && orderType === "스카이차" && { time: skyTime }),
                ...(skyFloor &&
                    orderType === "스카이차" && { floor: skyFloor }),
                ...(orderStatus && { orderStatusId: orderStatus }),
                ...(memo && { memo }),
                ...(directPhone && { directPhone }),
                ...(price && { price }),
                ...(price && { orderPrice: price }),
                ...(totalPrice && { totalPrice }),
                ...(tax && { tax }),
                ...(finalPrice && { finalPrice }),
                ...(recommendationPoint && { recommendationPoint }),
                ...(registPoint && { registPoint }),
                ...(orderPoint && { orderPoint }),
            },
            include: {
                registUser: true,
            },
        });

        if (!updatedOrder) throw new Error("작업상태 변경에 실패했습니다.");

        res.json(setResponseJson({ updatedOrder: updatedOrder }));
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};
