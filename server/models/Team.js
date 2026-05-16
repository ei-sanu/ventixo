import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    teamId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        email: {
          type: String,
          required: true,
          lowercase: true,
          trim: true,
        },
        userId: {
          type: String,
          trim: true,
        },
        status: {
          type: String,
          enum: ["registered", "pending"],
          default: "pending",
        },
      },
    ],
    teamType: {
      type: String,
      enum: ["Solo", "Duo", "Trio", "Quadra"],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
  },
);

teamSchema.index({ event: 1, "members.email": 1 });

export default mongoose.model("Team", teamSchema);
