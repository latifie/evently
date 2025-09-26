import express, { Router } from "express";
import { getEventSignup, getEventsSignups, signupToEvent, deleteEventSignup } from "../controllers/eventSignupController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

export const eventSignupRouter: Router = express.Router();

/**
 * @route GET /:id
 * @description Get event sign-up for current user if it exists.
 * @param {string} id - The ID of the event to retrieve the sign-up for.
 * @middleware verifyToken() - Ensures the user is authenticated to access this route.
 */
eventSignupRouter.get("/:id", verifyToken(), getEventSignup);

/**
 * @route GET /
 * @description Get all events sign-ups for current user.
 * @middleware verifyToken() - Ensures the user is authenticated to access this route.
 */
eventSignupRouter.get("/", verifyToken(), getEventsSignups);

/**
 * @route POST /:id
 * @description Sign-up current user to an existing event by their ID.
 * @param {string} id - The ID of the event to sign-up to.
 * @middleware verifyToken() - Ensures the user is authenticated to access this route.
 */
eventSignupRouter.post("/:id", verifyToken(), signupToEvent);

/**
 * @route DELETE /:id
 * @description Delete event sign-up for current user by event ID.
 * @param {string} id - The ID of the event to delete the sign-up for.
 * @middleware verifyToken() - Ensures the user is authenticated to access this route.
 */
eventSignupRouter.delete("/:id", verifyToken(), deleteEventSignup);
