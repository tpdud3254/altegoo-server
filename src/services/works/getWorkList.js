import prisma from "../../prisma";
import { setErrorJson, setResponseJson } from "../../utils";

export const getWorkList = async (req, res) => {
    const id = req.id;

    console.log(id);
    try {
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

        if (!workList) throw new Error("작업리스트 조회에 실패했습니다.");

        workList.map((work, index) => {
            if (work.address.includes("서울")) workList[index].regionCode = 1;
            else if (work.address.includes("인천"))
                workList[index].regionCode = 2;
            else if (work.address.includes("경기")) {
                if (
                    work.address.includes("김포") ||
                    work.address.includes("부천") ||
                    work.address.includes("파주") ||
                    work.address.includes("고양") ||
                    work.address.includes("동두천") ||
                    work.address.includes("연천")
                )
                    workList[index].regionCode = 3;
                else if (
                    work.address.includes("의정부") ||
                    work.address.includes("양주") ||
                    work.address.includes("구리") ||
                    work.address.includes("남양주") ||
                    work.address.includes("포천") ||
                    work.address.includes("가평")
                )
                    workList[index].regionCode = 4;
                else if (
                    work.address.includes("광명") ||
                    work.address.includes("시흥") ||
                    work.address.includes("안산") ||
                    work.address.includes("안양") ||
                    work.address.includes("과천") ||
                    work.address.includes("의왕") ||
                    work.address.includes("군포") ||
                    work.address.includes("수원") ||
                    work.address.includes("오산") ||
                    work.address.includes("화성") ||
                    work.address.includes("평택")
                )
                    workList[index].regionCode = 5;
                else if (
                    work.address.includes("성남") ||
                    work.address.includes("하남") ||
                    work.address.includes("광주") ||
                    work.address.includes("용인") ||
                    work.address.includes("안성") ||
                    work.address.includes("이천") ||
                    work.address.includes("여주") ||
                    work.address.includes("양평")
                )
                    workList[index].regionCode = 6;
            }
        });

        console.log(workList);

        res.json(setResponseJson({ list: workList }));
    } catch (error) {
        res.json(setErrorJson(error.message));
    }
};
