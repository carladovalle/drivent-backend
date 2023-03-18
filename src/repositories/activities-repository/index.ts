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

async function findActivitiesWithLocals(date: Date) {
  return prisma.local.findMany({
    include: {
      Activity: {
        where: {
          date,
        },
        orderBy: {
          date: "asc",
        },
        include: {
          _count: {
            select: {
              UserActivity: true,
            },
          },
        },
      },
    },
  });
}

async function findDaysWithActivities() {
  return prisma.activity.groupBy({
    by: ["date"],
    orderBy: {
      date: "asc",
    },
  });
}

async function getActivityById(activityId: number) {
  return prisma.activity.findFirst({
    where: {
      id: activityId,
    },
  });
}

async function getAllActivitiesFromUser(userId: number) {
  return prisma.userActivity.findMany({
    where: {
      userId,
    },
    include: {
      Activity: true,
    },
  });
}

async function getUserActivity(userId: number) {
  return prisma.userActivity.findMany({
    where: {
      userId,
    },
    select: {
      activityId: true,
    },
  });
}

const activitiesRepository = {
  findDates,
  findActivitiesWithLocals,
  findDaysWithActivities,
  getActivityById,
  getAllActivitiesFromUser,
  getUserActivity,
};

export default activitiesRepository;
