import { IUser } from "../interfaces/userInterface";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const User = {
  findAll: async () => {
    return await prisma.user.findMany();
  },
  findById: async (id: string) => {
    return await prisma.user.findUnique({
      where: { id: id },
    });
  },
  findByEmail: async (email: string) => {
    return await prisma.user.findUnique({
      where: { email: email },
    });
  },
  create: async (data: IUser) => {
    return await prisma.user.create({ data });
  },
  delete: async (id: string) => {
    return await prisma.user.delete({
      where: { id: id },
    });
  },
};

export default User;
