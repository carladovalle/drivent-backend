import activityRepository from "@/repositories/activityrepository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError, cannotListActivitiesError } from "@/errors";
import { formatDateWithWeekday } from "@/utils/format-date";

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

const activitiesService = {
  getDate,
  getActivitiesByLocals,
  getNumberOfUsersByActivityId,
};

export default activitiesService;
