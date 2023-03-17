import activitiesRepository from "@/repositories/activities-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";
import { formatDateWithWeekday } from "@/utils/format-date";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";

async function checkTicket(userId: number) {

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotListHotelsError();
  }
}

async function getDate(userId: number) {
  await checkTicket(userId);

  const dates = await activitiesRepository.findDates();
  const datesResult = dates.map((a) => formatDateWithWeekday(a.date));
  return datesResult;
}

const activitiesService = {
  getDate
};

export default activitiesService;
