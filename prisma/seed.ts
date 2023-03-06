import dayjs from "dayjs";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const event = await prisma.event.findFirst();
    if (!event) {
      await prisma.event.create({
        data: {
          title: "Driven.t",
          logoImageUrl: "https://files.driveneducation.com.br/images/logo-rounded.png",
          backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
          startsAt: dayjs().toDate(),
          endsAt: dayjs().add(21, "days").toDate(),
        },
      });
    }

    const ticketTypes = await prisma.ticketType.findMany();
    if (ticketTypes.length === 0) {
      await prisma.ticketType.createMany({
        data: [
          { name: "Online", price: 100, isRemote: true, includesHotel: false },
          { name: "Presencial", price: 250, isRemote: false, includesHotel: false },
          { name: "Presencial + Hotel", price: 600, isRemote: false, includesHotel: true },
        ],
      });
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
