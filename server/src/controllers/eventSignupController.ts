import { EventSignup } from "../models/eventSignupModel.js";
import { createLog } from "./logController.js";
import { logLevels } from "../utils/enums/logLevels.js";

/**
 * @function getEventSignup
 * @description Retrieves a single event signup by event & user IDs.
 * @returns {Object} JSON response with event sign-up if it exists, empty JSON otherwise or error message.
 */
export const getEventSignup = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const eventSignup = await EventSignup.find({ event: id, user: userId });
    if (Object.keys(eventSignup).length == 0) {
      res.status(204).json();
    } else {
      res.status(200).json(eventSignup);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @function getEventsSignups
 * @description Retrieves all events sign-ups for current user, sorted by creation date.
 * @returns {Object} JSON response with a list of events sign-ups or error message.
 */
export const getEventsSignups = async (req, res) => {
  const size = parseInt(req.query.size);
  const page = parseInt(req.query.page);
  const userId = req.userId;

  try {
    const eventsSignups = await EventSignup.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(page * size)
      .limit(size);

    const count = await EventSignup.countDocuments();

    res.status(200).json({ eventsSignups, count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @function signupToEvent
 * @description Sign-up current user to an event by ID.
 * @returns {Object} JSON response with event sign-up details or error message.
 */
export const signupToEvent = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const curEventSignup = await EventSignup.find({ event: id, user: userId });
    if (Object.keys(curEventSignup).length != 0) {
      return res.status(400).json({ error: "Already exists" });
    }

    createLog({
      message: `Signed-up to event ID '${id}' successfully`,
      userId: userId,
      level: logLevels.INFO,
    });

    const eventSignup = await EventSignup.create({ event: id, user: userId });
    if (!eventSignup) return res.status(404).json({ error: "server.global.errors.no_such_event_signup" });

    res.status(200).json({ eventSignup, message: "server.events.messages.event_signup_created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @function deleteEventSignup
 * @description Deletes an event sign-up by event & user IDs.
 * @returns {Object} JSON response with success message or error message.
 */
export const deleteEventSignup = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const eventSignup = await EventSignup.findOneAndDelete({ event: id, user: userId });
    if (!eventSignup) return res.status(400).json({ error: "No such event sign-up" });

    createLog({
      message: `Event sign-up for event ID '${id}' deleted successfully`,
      userId: userId,
      level: logLevels.INFO,
    });

    res.status(200).json({ eventSignup, message: "Event sign-up deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
