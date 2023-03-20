import eventsService from "@/services/events-service";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { redisClient } from "@/config/database";

export async function getDefaultEvent(_req: Request, res: Response) {
  try {
    const events = await redisClient.get("events");
    if (events != null) return res.status(httpStatus.OK).send(events);

    const eventsFromDb = await eventsService.getFirstEvent();
    await redisClient.set("events", JSON.stringify(eventsFromDb));
    return res.status(httpStatus.OK).send(eventsFromDb);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}
