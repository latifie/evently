import express, { Router } from "express";
import { getEvents, getEvent, createEvent, updateEvent, deleteEvent } from "../controllers/eventController";
import { verifyToken } from "../middlewares/verifyToken.js";

export const eventRouter: Router = express.Router();

/**
 * @route GET /:id
 * @description Retrieves a single event by their ID.
 */
eventRouter.get("/:id", getEvent);

/**
 * @route GET /
 * @description Retrieves a list of all events.
 */
eventRouter.get("/", getEvents);

/**
 * @route POST /
 * @description Creates a new event with the provided data.
 * @middleware verifyToken({ role: "admin" }) - Ensures the user has an admin role to access this route.
 */
eventRouter.post("/", verifyToken({ role: "admin" }), createEvent);

/**
 * @route PUT /:id
 * @description Updates an existing event by their ID.
 * @param {string} id - The ID of the event to update.
 * @middleware verifyToken({ role: "admin" }) - Ensures the user has an admin role to access this route.
 */
eventRouter.put("/:id", verifyToken({ role: "admin" }), updateEvent);

/**
 * @route DELETE /:id
 * @description Deletes a event by their ID.
 * @param {string} id - The ID of the event to delete.
 * @middleware verifyToken({ role: "admin" }) - Ensures the user has an admin role to access this route.
 */
eventRouter.delete("/:id", verifyToken({ role: "admin" }), deleteEvent);
