import prisma from "../../prisma";
import { getUserRestInfo } from "../../utils";

export const registWork = async (req, res) => {
  const {
    workDate,
    workTime,
    workType,
    workHeight,
    workFloor,
    upDown,
    phone,
    workQuantity,
    address,
    sendAddress,
    cost,
    commission,
    onSitePayment,
    memo,
  } = req.body;

  console.log(req.body);

  const id = req.id;

  const now = new Date();

  const registDate = `${now.getFullYear()}-${
    now.getMonth() < 10 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1
  }-${now.getDate() < 10 ? "0" + now.getDate() : now.getDate()}`;
  console.log(id);

  const registTime = `${
    now.getHours() < 10 ? "0" + now.getHours() : now.getHours()
  }:${now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes()}`;

  try {
    const regist = await prisma.order.create({
      data: {
        registUser: {
          connect: {
            id,
          },
        },
        registDate,
        registTime,
        workDate,
        workTime,
        workType,
        workHeight,
        workFloor,
        upDown,
        phone,
        workQuantity,
        address,
        sendAddress,
        cost,
        commission,
        onSitePayment,
        memo,
        status: {
          connect: {
            id: 1,
          }, //TODO: 임시등록으로 설정한 뒤 서버에서 타이머 돌린 뒤 자동으로 바뀌게 하기 중간에 요청 ㄷ르어오면 타이머 종료한뒤 바로 바꾸고 status값 변경
        },
        private: true,
        workGrade: "NORMAL",
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
