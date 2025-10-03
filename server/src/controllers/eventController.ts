import { Event } from "../models/eventModel.js";
import { User } from "../models/userModel.js";
import { createLog } from "./logController.js";
import { logLevels } from "../utils/enums/logLevels.js";

import fs from "fs";
import path from "path";

/**
 * @function getEvent
 * @description Retrieves a single event by ID.
 * @returns {Object} JSON response with event details or error message.
 */
export const getEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(400).json({ error: "No such event" });
    }
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @function getEvents
 * @description Retrieves all events sorted by creation date.
 * @returns {Object} JSON response with a list of events or error message.
 */
export const getEvents = async (req, res) => {
  const size = parseInt(req.query.size);
  const page = parseInt(req.query.page);

  try {
    const events = await Event.find({})
      .sort({ createdAt: -1 })
      .populate("owner")
      .skip(page * size)
      .limit(size);

    const count = await Event.countDocuments();

    res.status(200).json({ events, count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @function createEvent
 * @description Creates a new event with the provided details.
 * @returns {Object} JSON response with event details or error message.
 */
export const createEvent = async (req, res) => {
  const { name } = req.body;
  const userId = req.userId;

  if (!name) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    if (!userId || !(await User.findById(userId))) {
      return res.status(400).json({ error: "No such user" });
    }

    const event = await Event.create({
      owner: userId,
      ...req.body,
    });

    createLog({
      message: `Event '${name}' created successfully`,
      userId: userId,
      level: logLevels.INFO,
    });

    res.status(201).json({ event, message: "Event created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @function updateEvent
 * @description Updates a event's details by ID.
 * @returns {Object} JSON response with updated event details or error message.
 */
export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const { name, ownerId } = req.body;

  try {
    createLog({
      message: `Event '${name}' updated successfully`,
      userId: userId,
      level: logLevels.INFO,
    });

    const event = await Event.findOneAndUpdate({ _id: id }, { owner: ownerId, ...req.body }, { new: true });
    if (!event) return res.status(404).json({ error: "server.global.errors.no_such_event" });

    res.status(200).json({ event, message: "server.events.messages.event_updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @function deleteEvent
 * @description Deletes a event by ID.
 * @returns {Object} JSON response with success message or error message.
 */
export const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findOneAndDelete({ _id: id });
    if (!event) return res.status(400).json({ error: "No such event" });

    if (event.avatar) {
      const oldAvatarPath = path.join(process.cwd(), "uploads", "events", "avatars", path.basename(event.avatar));
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    createLog({
      message: `Event '${event.name}' deleted successfully`,
      userId: req.userId,
      level: logLevels.INFO,
    });

    res.status(200).json({ event, message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
