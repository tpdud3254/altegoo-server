import prisma from "../../prisma";

export const deleteReservation = async (req, res) => {
  const { orderId } = req.body;
  const id = req.id;

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

    if (reservationId) {
      const deleteResult = await prisma.orderReservation.delete({
        where: { id: reservationId },
      });

      if (deleteResult) {
        res.status(200).json({
          result: "VALID",
        });
      } else {
        res.status(400).json({
          result: "INVALID: FAIL TO FIND WORK LIST",
          msg: "예약대기 해제에 실패했습니다.",
        });
      }
    } else {
      res.status(400).json({
        result: "INVALID: FAIL TO FIND WORK LIST",
        msg: "예약대기 해제에 실패했습니다.",
      });
    }
  } else {
    res.status(400).json({
      result: "INVALID: FAIL TO FIND WORK LIST",
      msg: "예약대기가 존재하지 않습니다.",
    });
  }
};
