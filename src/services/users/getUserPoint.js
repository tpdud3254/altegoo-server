import prisma from "../../prisma";

export const getUserPoint = async (req, res) => {
  const id = req.id;

  console.log(id);
  const point = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      point: true,
    },
  });

  console.log(point);

  if (point) {
    res.status(200).json({ result: "VALID", data: { point: point.point } });
  } else {
    res.status(400).json({
      result: "INVALID",
      msg: "포인트 정보를 불러올 수 없습니다.",
    });
  }
};
