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

    const hotel = await prisma.hotel.findFirst();
    if (!hotel) {
      await prisma.hotel.createMany({
        data: [
          {
            name: "Driven Resort",
            image: "https://viajandocomamalarosa.com.br/wp-content/uploads/2020/05/Ocean-Palace.jpg",
          },
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

async function seedRooms() {
  let rooms = await prisma.room.findFirst();
  if (!rooms) {
    const hotel = await prisma.hotel.findFirst();
    if (hotel) {
      const totalOfRooms = 16;
      const initialRoom = 100;
      let roomType = 1;
      for (let i = 1; i <= totalOfRooms; i++) {
        await prisma.room.create({
          data: {
            name: String(initialRoom + i),
            capacity: roomType,
            hotelId: hotel.id,
            updatedAt: dayjs().toDate(),
          },
        });
        roomType++;
        if (roomType > 3) roomType = 1;
      }
    }
  }
}

seedRooms()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
