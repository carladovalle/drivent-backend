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
    orderBy: {
      name: "asc",
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

async function findUsersByActivityId(activityId: number) {
  return prisma.userActivity.findMany({
    where: { activityId },
  });
}

async function findAllActivitiesFromUser(userId: number) {
  return prisma.userActivity.findMany({
    where: {
      userId,
    },
    include: {
      Activity: true,
    },
  });
}

async function findById(id: number) {
  return prisma.activity.findUnique({
    where: {
      id,
    },
  });
}

async function findUsersAndCapacityOfActivity(activityId: number) {
  return prisma.activity.findMany({
    where: { id: activityId },
    include: {
      UserActivity: true
    }
  });
}

async function insertUserActivity(userId: number, activityId: number) {
  return prisma.userActivity.create({ data: { userId, activityId } });
}

const activityRepository = {
  findDates,
  findActivitiesWithLocals,
  findDaysWithActivities,
  findUsersByActivityId,
  findAllActivitiesFromUser,
  findById,
  findUsersAndCapacityOfActivity,
  insertUserActivity
};

export default activityRepository;
