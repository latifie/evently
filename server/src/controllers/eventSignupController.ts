import { EventSignup } from "../models/eventSignupModel.js";
import { Event } from "../models/eventModel.js";
import { createLog } from "./logController.js";
import { logLevels } from "../utils/enums/logLevels.js";
import { updateCapacityLeft } from "../utils/updateCapacity.js";

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
    // Vérifie si déjà inscrit
    const curEventSignup = await EventSignup.findOne({ event: id, user: userId });
    if (curEventSignup) {
      return res.status(400).json({ error: "Already signed up" });
    }

    // Récupère l'événement
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ error: "No such event" });

    const isFree = !event.price || event.price <= 0;

    // Bloque l'inscription si capacityLeft est défini et <= 0
    if (event.capacityLeft !== null && event.capacityLeft <= 0) {
      return res.status(400).json({ error: "Event is full" });
    }

    // Détermine paid
    const paid = !isFree;

    // Crée l'inscription
    const eventSignup = await EventSignup.create({ event: id, user: userId, paid });
    await updateCapacityLeft(id);

    // (optionnel) décrémente capacityLeft
    if (event.capacityLeft !== null) {
      event.capacityLeft = event.capacityLeft - 1;
      await event.save();
    }

    await createLog({
      message: `Signed-up to event ID '${id}' successfully`,
      userId,
      level: logLevels.INFO,
    });

    res.status(200).json({ eventSignup, message: "Event signup created successfully" });
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
    await updateCapacityLeft(id);

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
