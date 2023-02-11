//getUser
//protectedResolver 로그인해야지 서비스르르 이용할수있는건데 이게 꼭 필요할까?

import prisma from "./prisma";

export const existUser = (phone) =>
    prisma.user.findUnique({
        where: { phone },
    });

export const craeteUserId = (code, id) => {
    return code + String(id).padStart(5, "0");
};
