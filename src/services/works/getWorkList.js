import prisma from "../../prisma";

export const getWorkList = async (req, res) => {
  const id = req.id;

  console.log(id);
  try {
    const workList = await prisma.order.findMany({
      include: {
        registUser: { select: { userName: true } },
      },
      orderBy: {
        id: "desc",
      },
      // take: 5,
      // skip: lastUserId ? 1 : 0,
      // ...(lastUserId && { cursor: { id: lastUserId } }),
      //TODO: pagination
    });

    console.log(workList);
    if (workList) {
      res.status(200).json({
        result: "VALID",
        data: { list: workList },
      });
    } else {
      res.status(400).json({
        result: "INVALID: FAIL TO FIND WORK LIST",
        msg: "작업리스트 조회에 실패했습니다.",
      });
    }
  } catch (error) {
    res.status(400).json({
      result: "INVALID: ERROR",
      error,
      msg: "작업리스트 조회에 실패했습니다.",
    });
  }
};
