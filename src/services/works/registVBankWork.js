import prisma from "../../prisma";
import {
    GetCommissionList,
    SetTimer,
    getUserExpoToken,
    sendPushToUser,
    setErrorJson,
    setResponseJson,
} from "../../utils";

export const registVBankWork = async (req, res) => {
    const {
        vehicleType,
        direction,
        floor,
        downFloor,
        upFloor,
        volume,
        time,
        quantity,
        dateTime,
        address1,
        address2,
        detailAddress1,
        detailAddress2,
        simpleAddress1,
        simpleAddress2,
        region,
        latitude,
        longitude,
        phone,
        directPhone,
        memo,
        emergency,
        price,
        emergencyPrice,
        usePoint,
        orderPrice,
        totalPrice,
        gugupackPrice,
        tax,
        finalPrice,
        method,
        isDesignation,
        driverId,
        receipt_id,
        vbank_account,
        vbank_code,
        vbank_name,
        vbank_expired_at,
        vbank_tid,
    } = req.body;

    console.log(req.body);

    const id = req.id;

    try {
        const commissionList = await GetCommissionList();

        //작업등록
        const regist = await prisma.vBankOrder.create({
            data: {
                registUser: { connect: { id } },
                vehicleType,
                direction,
                floor,
                downFloor,
                upFloor,
                volume,
                time,
                quantity,
                dateTime,
                address1,
                detailAddress1,
                simpleAddress1,
                address2,
                detailAddress2,
                simpleAddress2,
                region: { connect: { id: region } },
                latitude,
                longitude,
                phone,
                directPhone,
                emergency,
                memo,
                price,
                emergencyPrice,
                usePoint,
                orderPrice,
                totalPrice,
                gugupackPrice,
                tax,
                finalPrice,
                recommendationPoint: 0,
                registPoint: 0,
                orderPoint: 0,
                method,
                status: { connect: { id: 1 } },
                isDesignation,
                driverId,
                receipt_id,
                vbank_account,
                vbank_code,
                vbank_name,
                vbank_expired_at,
                vbank_tid,
                cardCommission: commissionList.cardCommission,
            },
        });

        if (!regist) throw new Error("작업 등록에 실패하였습니다.");

        const cancelVBankIssuance = async (receipt_id) => {
            console.log("start!");

            try {
                const order = await prisma.vBankOrder.findUnique({
                    where: { receipt_id },
                    include: {
                        registUser: { select: { id: true } },
                        orderReservation: true,
                    },
                });

                if (order.standBy === true && order.orderStatusId === 1) {
                    const result = await prisma.vBankOrder.update({
                        where: { receipt_id },
                        data: {
                            orderStatusId: 7,
                        },
                    });

                    sendPushToUser(
                        await getUserExpoToken(result.userId),
                        "가상계좌 발급 취소",
                        "가상계좌 만료 시간이 경과되어 가상계좌 발급이 취소되었습니다.",
                        null
                    );
                }
            } catch (error) {}
        };

        SetTimer(() => cancelVBankIssuance(receipt_id), 1000 * 60 * 10);

        res.json(setResponseJson({ order: regist }));
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};
