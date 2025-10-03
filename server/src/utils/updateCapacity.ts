// utils/capacityUtils.js

import { Event } from "../models/eventModel.js";
import { EventSignup } from "../models/eventSignupModel.js";

/**
 * Recalcule capacityLeft d’un événement selon le nombre d’inscrits.
 */
export const updateCapacityLeft = async (eventId) => {
  const event = await Event.findById(eventId);
  if (!event) return;

  if (event.capacity === null || event.capacity === undefined) return;

  const signupCount = await EventSignup.countDocuments({ event: eventId });
  event.capacityLeft = event.capacity - signupCount;

  await event.save();
};
