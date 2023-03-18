import { prisma } from "@/config";

async function findDates() {
  return prisma.activity.findMany({
    include: {
      Local: true,
    },
    orderBy: {
      date: "asc",
    },
  });
}

const activitiesRepository = {
  findDates,
};

export default activitiesRepository;
