import prisma from "../../prisma";
import { setErrorJson } from "../../utils";

export const registWork = async (req, res) => {
  const {
    workDateTime,
    type,
    bothType,
    address1,
    simpleAddress1,
    address2,
    simpleAddress2,
    regionId,
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
        address1,
        simpleAddress1,
        address2,
        simpleAddress2,
        region: { connect: { id: regionId } },
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

    if (!regist) throw new Error("작업 등록에 실패하였습니다.");

    res.json(setResponseJson(null));
  } catch (error) {
    res.json(setErrorJson(error.message));
  }
};
