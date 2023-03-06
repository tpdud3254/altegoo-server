import prisma from "../../prisma";
import { getUserRestInfo } from "../../utils";

export const registWork = async (req, res) => {
  const {
    workDateTime,
    type,
    bothType,
    address,
    otherAddress,
    floor,
    otherFloor,
    phone,
    directPhone,
    price,
    point,
    volumeType,
    quantity,
    time,
    vehicleType,
    emergency,
    memo,
  } = req.body;

  console.log(req.body);

  const id = req.id;

  //TODO: 첫 등록시 포인트 지급
  try {
    const regist = await prisma.order.create({
      data: {
        registUser: { connect: { id } },
        workDateTime,
        type,
        bothType,
        address,
        otherAddress,
        floor,
        otherFloor,
        phone,
        directPhone,
        price,
        point,
        volumeType,
        quantity,
        time,
        vehicleType,
        emergency,
        memo,
        status: { connect: { id: 1 } },
      },
    });
    console.log(regist);
    if (regist) {
      res.status(200).json({
        result: "VALID",
      });
    } else {
      res.status(400).json({
        result: "INVALID: FAIL TO REGIST WORK",
        msg: "작업 등록에 실패하였습니다.",
      });
    }
  } catch (error) {
    res.status(400).json({
      result: "INVALID: ERROR",
      error,
      msg: "작업 등록에 실패하였습니다.",
    });
  }
};
