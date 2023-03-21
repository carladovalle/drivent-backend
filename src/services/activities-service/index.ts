import activityRepository from "@/repositories/activityrepository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError, cannotListActivitiesError, conflictError } from "@/errors";
import { formatDateWithWeekday } from "@/utils/format-date";
import { Activity, UserActivity } from "@prisma/client";

async function checkTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote) {
    throw cannotListActivitiesError();
  }
}

async function getDate(userId: number) {
  await checkTicket(userId);

  const dates = await activityRepository.findDates();
  const datesResult = dates.map((a) => formatDateWithWeekday(a.date));
  return datesResult;
}

async function getActivitiesByLocals(userId: number, date: Date) {
  await checkTicket(userId);

  const locations = await activityRepository.findActivitiesWithLocals(date);
  if (!locations) {
    throw notFoundError();
  }

  return locations;
}

async function getNumberOfUsersByActivityId(userId: number, activityId: number) {
  await checkTicket(userId);

  const result = (await activityRepository.findUsersByActivityId(activityId)).length;
  if (result === null) {
    throw notFoundError();
  }
  return result;
}

async function postUserActivity(userId: number, activityId: number) {
  const result: (Activity & { UserActivity: UserActivity[]; })[] = await activityRepository.findUsersAndCapacityOfActivity(activityId);
  if (result.length === 0) {
    throw notFoundError();
  }

  const activity = result[0];

  if (activity.UserActivity.length >= activity.capacity) {
    throw conflictError('Vacancies sold out');
  }

  await activityRepository.insertUserActivity(userId, activityId);
}

const activitiesService = {
  getDate,
  getActivitiesByLocals,
  getNumberOfUsersByActivityId,
  postUserActivity
};

export default activitiesService;
