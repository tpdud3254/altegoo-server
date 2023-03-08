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

    if (workList) {
      res.status(200).json({
        result: "VALID",
        data: { list: workList },
      });
    } else {
      res.status(400).json({
        result: "INVALID: FAIL TO FIND WORK LIST",
        msg: "예약대기에 실패했습니다.",
      });
    }
  } else {
    res.status(400).json({
      result: "INVALID: FAIL TO FIND WORK LIST",
      msg: "예약대기에 실패했습니다.",
    });
  }
};
