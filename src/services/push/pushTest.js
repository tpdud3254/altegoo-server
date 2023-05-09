import { PrismaClient } from "@prisma/client";
import prisma from "../../prisma";
import {
  sendPushToUsers,
  sendPushToUser,
  sendPushToAllUsers,
  getRegionToString,
} from "../../utils";

export const pushTest = async (req, res) => {
  // const response = await sendPushToUser(
  //   "ExponentPushToken[u2z7TMDzFkDHlzxe8pezVt]",
  //   "send?",
  //   "send!"
  // );

  // const response = await sendPushToUsers(
  //     [
  //         "ExponentPushToken[u2z7TMDzFkDHlzxe8pezVt]",
  //         "ExponentPushToken[Z1uqJ_NbaqRzNtrec7IytG]",
  //     ],
  //     "send?",
  //     "send!"
  // );

  // const response = await sendPushToAllUsers("send?", "send!");

  const now = new Date();

  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { orderStatusId: 2 },
        { orderStatusId: 3 },
        { orderStatusId: 4 },
        { orderStatusId: 5 },
      ],
    },
    orderBy: {
      orderStatusId: "asc",
    },
  });

  const before10Mins = [];
  const before2Hours = [];
  const before12Hours = [];
  const before24Hours = [];

  const afterWorkDateTime1 = [];
  const afterWorkDateTime2 = [];

  //id, pushStatus, acceptUser, pushToken
  /*
  1. pushStatus 검증 후 배열에 추가 (orderId, acceptUser, pushToken, msg)
  2. pushToken 배열 생성 후  push send
  3. 해당 orderId 배열 생성 후 pushStatus값 변경
  어떤 방법이 좋을까,,
  */

  const makeNewObj = async (orderId, acceptUser, msg) => {
    const user = await prisma.user.findUnique({
      where: {
        id: acceptUser,
      },
      select: {
        pushToken: true,
      },
    });

    return {
      orderId,
      acceptUser,
      pushToken: user.pushToken,
      msg,
    };
  };

  await Promise.all(
    orders.map(async (order) => {
      if (order.pushStatus === "DONE") {
        return;
      }
      const orderDate = new Date(order.workDateTime);
      const orderHours = orderDate.getHours();
      const orderMins = orderDate.getMinutes();

      if (now < orderDate) {
        if (order.orderStatusId === 2) {
          const compareDate = new Date(orderDate);

          //10분 전
          compareDate.setMinutes(orderDate.getMinutes() - 10);
          if (compareDate < now) {
            if (order.pushStatus !== "BEFORE_10MINS") {
              const newObj = await makeNewObj(
                order.id,
                order.acceptUser,
                `${orderHours}시 ${orderMins}분 ${getRegionToString(
                  order.regionId
                )}지역의 작업이 10분 뒤 시작될 예정입니다.`
              );

              before10Mins.push(newObj);
            }
            return;
          }

          //2시간 전
          compareDate.setHours(orderDate.getHours() - 2);
          if (compareDate < now) {
            if (order.pushStatus !== "BEFORE_2HOURS") {
              const newObj = await makeNewObj(
                order.id,
                order.acceptUser,
                `${orderHours}시 ${orderMins}분 ${getRegionToString(
                  order.regionId
                )}지역의 작업이 2시간 뒤 시작될 예정입니다.`
              );

              before2Hours.push(newObj);
            }
            return;
          }

          //12시간 전
          compareDate.setHours(orderDate.getHours() - 12);
          if (compareDate < now) {
            if (order.pushStatus !== "BEFORE_12HOURS") {
              const newObj = await makeNewObj(
                order.id,
                order.acceptUser,
                `${orderHours}시 ${orderMins}분 ${getRegionToString(
                  order.regionId
                )}지역의 작업이 12시간 뒤 시작될 예정입니다.`
              );

              before12Hours.push(newObj);
            }
            return;
          }

          //24시간 전
          compareDate.setHours(orderDate.getHours() - 24);
          if (compareDate < now) {
            if (order.pushStatus !== "BEFORE_24HOURS") {
              const newObj = await makeNewObj(
                order.id,
                order.acceptUser,
                `${orderHours}시 ${orderMins}분 ${getRegionToString(
                  order.regionId
                )}지역의 작업이 24시간 뒤 시작될 예정입니다.`
              );

              before24Hours.push(newObj);
            }
            return;
          }
        }
      } else {
        const compareDate = new Date(now);
        compareDate.setHours(compareDate.getHours() - 5);

        if (compareDate <= orderDate) {
          if (order.orderStatusId === 2 || order.orderStatusId === 3) {
            if (order.pushStatus !== "AFTER_WORKDATETIME") {
              const newObj = await makeNewObj(
                order.id,
                order.acceptUser,
                "작업 시작을 누르고 작업을 시작해 주세요."
              );

              afterWorkDateTime1.push(newObj);
            }
          }
        } else {
          if (order.orderStatusId === 3 || order.orderStatusId === 4) {
            if (order.pushStatus !== "AFTER_WORKDATETIME") {
              const newObj = await makeNewObj(
                order.id,
                order.acceptUser,
                "작업 진행 중 이신가요? 작업이 완료되면 작업 완료를 눌러주세요."
              );

              afterWorkDateTime2.push(newObj);
            }
          }
        }
      }
    })
  );

  console.log("before10Mins : ", before10Mins);
  console.log("before2Hours : ", before2Hours);
  console.log("before12Hours : ", before12Hours);
  console.log("before24Hours : ", before24Hours);
  console.log("afterWorkDateTime1 : ", afterWorkDateTime1);
  console.log("afterWorkDateTime2 : ", afterWorkDateTime2);

  before10Mins.map(async (value) => {
    const result = await sendPushToUser(
      value.pushToken,
      "작업 시작 예정",
      value.msg
    );

    // if (result) {
    //   const updatePushStatus = await prisma.order.update({
    //     where: {
    //       id: value.orderId,
    //     },
    //     data: {
    //       pushStatus: "BEFORE_10MINS",
    //     },
    //   });
    // }
  });

  before2Hours.map(async (value) => {
    const result = await sendPushToUser(
      value.pushToken,
      "작업 시작 예정",
      value.msg
    );
  });

  before12Hours.map(async (value) => {
    const result = await sendPushToUser(
      value.pushToken,
      "작업 시작 예정",
      value.msg
    );
  });

  before24Hours.map(async (value) => {
    const result = await sendPushToUser(
      value.pushToken,
      "작업 시작 예정",
      value.msg
    );
  });

  const pushToken1 = [];
  const pushToken2 = [];

  afterWorkDateTime1.map((value) => {
    pushToken1.push(value.pushToken);
  });

  afterWorkDateTime2.map((value) => {
    pushToken2.push(value.pushToken);
  });

  const result1 = await sendPushToUsers(
    pushToken1,
    "작업 시작",
    "작업 시작을 누르고 작업을 시작해 주세요."
  );
  const result2 = await sendPushToUsers(
    pushToken2,
    "작업 진행 중 이신가요?",
    "작업이 완료되면 작업 완료를 눌러주세요."
  );
};
