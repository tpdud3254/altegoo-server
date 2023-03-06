import prisma from "../../prisma";

export const addReservation = async (req, res) => {
  const { orderId } = req.body;

  const id = req.id;

  const reservation = await prisma.orderReservation.create({
    data: {
      user: {
        connect: { id },
      },
      order: {
        connect: {
          id: orderId,
        },
      },
    },
  });

  if (reservation) {
    res.status(200).json({
      result: "VALID",
    });
  } else {
    res.status(400).json({
      result: "INVALID: FAIL TO FIND WORK LIST",
      msg: "예약대기에 실패했습니다.",
    });
  }
};
