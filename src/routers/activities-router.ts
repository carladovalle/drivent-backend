import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getDates, getActivitiesWithLocals, getNumberOfUsersByActivity } from "@/controllers";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .get("/dates", getDates)
  .get("/:date", getActivitiesWithLocals)
  .get("/available/:activityId", getNumberOfUsersByActivity);

export { activitiesRouter };
