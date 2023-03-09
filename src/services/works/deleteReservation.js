import prisma from "../../prisma";
import { setErrorJson } from "../../utils";

export const deleteReservation = async (req, res) => {
  const { orderId } = req.body;
  const id = req.id;

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        orderReservation: true,
      },
    });

    if (order.orderReservation.length > 0) {
      console.log(order.orderReservation);
      let reservationId = null;

      order.orderReservation.map((value, index) => {
        if (!reservationId && value.userId === id) {
          reservationId = value.id;
        }
      });

      if (!reservationId) throw new Error("예약대기 해제에 실패했습니다.");

      const deleteResult = await prisma.orderReservation.delete({
        where: { id: reservationId },
      });

      if (!deleteResult) throw new Error("예약대기 해제에 실패했습니다.");

      const workList = await prisma.order.findMany({
        include: {
          registUser: { select: { userName: true } },
          orderReservation: true,
        },
        orderBy: {
          id: "desc",
        },
        // take: 5,
        // skip: lastUserId ? 1 : 0,
        // ...(lastUserId && { cursor: { id: lastUserId } }),
        //TODO: pagination
      });

      if (!workList) throw new Error("예약대기 해제에 실패했습니다.");
      res.json(setResponseJson({ list: workList }));
    } else {
      throw new Error("예약대기 해제에 실패했습니다.");
    }
  } catch (error) {
    res.json(setErrorJson(error.message));
  }
};
