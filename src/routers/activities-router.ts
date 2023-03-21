import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getDates, getActivitiesWithLocals, getNumberOfUsersByActivity, getRegistrations } from "@/controllers";
import { postUserActivity } from "@/controllers";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .get("/dates", getDates)
  .get("/:date", getActivitiesWithLocals)
  .get("/available/:activityId", getNumberOfUsersByActivity)
  .post("/subscribe/:activityId", postUserActivity)
  .get("/", getRegistrations);

export { activitiesRouter };
