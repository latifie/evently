import mongoose from "mongoose";
import { generateRandomAvatar } from "../utils/generateRandomAvatar.js";

const EventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    end_date: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: false,
      enum: ["Conférence", "Webinar", "Atelier", "Formation", "Autre"],
    },
    price: {
      type: Number,
      min: 0,
      default: 0,
    },
    capacity: {
      type: Number,
      min: 0,
      default: null,
    },
    capacityLeft: {
      type: Number,
      min: 0,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

EventSchema.pre("save", function (next) {
  if (this.isNew) {
    this.capacityLeft = this.capacity ?? null;
  }
  next();
});

export const Event = mongoose.model("Event", EventSchema);
