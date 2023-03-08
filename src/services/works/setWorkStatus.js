import prisma from "../../prisma";

export const setWorkStatus = async (req, res) => {
  const { id: orderId, status } = req.body;
  const id = req.id;
  console.log(id, status);

  if (status === 1) {
    //예약 중 -> 요청 중으로 변경 전 예약 대기 있는지 확인하고 있으면 예약대기중인 사람이 예약하기
    const reservation = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      select: {
        orderReservation: true,
      },
    });

    if (reservation.orderReservation.length > 0) {
      console.log(reservation.orderReservation[0]);
      const work = await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          acceptUser: id,
        },
      });

      if (work) {
        const deleteResult = await prisma.orderReservation.delete({
          where: { id: reservation.orderReservation[0].id },
        });

        console.log(deleteResult);
        if (deleteResult) {
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
              msg: "작업상태 변경에 실패했습니다.",
            });
          }
          //TODO: 새 예약자한테 알림

          return;
        } else {
          res.status(400).json({
            result: "INVALID: FAIL TO FIND WORK LIST",
            msg: "작업상태 변경에 실패했습니다.",
          });
          return;
        }
      }
    } else {
      //예약대기가 없을 경우 그냥 삭제
      const work = await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          acceptUser: null,
          status: {
            connect: {
              id: status,
            },
          },
        },
      });

      if (work) {
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
            msg: "작업상태 변경에 실패했습니다.",
          });
        }

        return;
      } else {
        res.status(400).json({
          result: "INVALID: FAIL TO FIND WORK LIST",
          msg: "작업상태 변경에 실패했습니다.",
        });
        return;
      }
    }
  }

  const work = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      acceptUser: id,
      status: {
        connect: {
          id: status,
        },
      },
    },
  });

  if (work) {
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
        msg: "작업상태 변경에 실패했습니다.",
      });
    }
  } else {
    res.status(400).json({
      result: "INVALID: FAIL TO FIND WORK LIST",
      msg: "작업상태 변경에 실패했습니다.",
    });
  }

  console.log(work);
};
