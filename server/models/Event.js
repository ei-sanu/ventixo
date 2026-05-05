import mongoose from "mongoose";

export const EVENT_CATEGORIES = ["Tech", "Cultural", "Other"];
export const TEAM_TYPES = ["Solo", "Duo", "Trio", "Quadra"];

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 3000,
    },
    category: {
      type: String,
      enum: EVENT_CATEGORIES,
      required: true,
      index: true,
    },
    teamType: {
      type: String,
      enum: TEAM_TYPES,
      required: true,
    },
    maxParticipants: {
      type: Number,
      required: true,
      min: 1,
      max: 10000,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.id;
        return ret;
      },
    },
  },
);

eventSchema.index({ status: 1, isPublished: 1, date: 1 });
eventSchema.index({ organizer: 1, createdAt: -1 });

export default mongoose.model("Event", eventSchema);
