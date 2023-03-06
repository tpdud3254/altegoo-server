import prisma from "../../prisma";

export const getMyWorkList = async (req, res) => {
  const id = req.id;

  const orders = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      order: true,
    },
  });

  if (orders) {
    res.status(200).json({
      result: "VALID",
      data: { list: orders.order },
    });
  } else {
    res.status(400).json({
      result: "INVALID",
      msg: "내 작업 불러오기에 실패하였습니다.",
    });
  }
};
