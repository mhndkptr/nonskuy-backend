import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("IntegratedDev24@", 10);
  const userPassword = await bcrypt.hash("password", 10);

  const adminUser = await prisma.user.create({
    data: {
      email: "developer@dev.com",
      username: "developer",
      fullname: "Admin Developer",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin User Created:", adminUser);

  const regularUser = await prisma.user.create({
    data: {
      email: "muhhendikaputra@gmail.com",
      username: "muhhendikaputra",
      fullname: "Muhammad Hendika Putra",
      password: userPassword,
      role: "USER",
    },
  });

  console.log("Regular User Created:", regularUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
