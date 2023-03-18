import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import activitiesService from "@/services/activities-service";
import httpStatus from "http-status";

export async function getDates(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const date = await activitiesService.getDate(Number(userId));
    return res.status(httpStatus.OK).send(date);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getActivitiesWithLocals(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { date } = req.params;
  const newDate = new Date(date.replace("-", "/"));
  try {
    const activities = await activitiesService.getActivitiesByLocals(userId, newDate);
    res.status(httpStatus.OK).send(activities);
    return;
  } catch (error) {
    if (error.name === "NotFoundError") {
      res.sendStatus(httpStatus.NOT_FOUND);
      return;
    }
    res.sendStatus(httpStatus.BAD_REQUEST);
    return;
  }
}

export async function getNumberOfUsersByActivity(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { activityId } = req.params;
  try {
    const numberOfUsers = await activitiesService.getNumberOfUsersByActivityId(userId, Number(activityId));
    res.send({ numberOfUsers });
    return;
  } catch (error) {
    if (error.name === "NotFoundError") {
      res.sendStatus(httpStatus.NOT_FOUND);
      return;
    }
    res.sendStatus(httpStatus.BAD_REQUEST);
    return;
  }
}
