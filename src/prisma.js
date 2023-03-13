import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const connect = async () => {
  await prisma.$connect();
};

connect();
export default prisma;
