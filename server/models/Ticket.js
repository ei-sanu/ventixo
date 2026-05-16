import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    ticketCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "used", "cancelled"],
      default: "active",
      index: true,
    },
    validatedAt: {
      type: Date,
    },
    registrationDetails: {
      fullName: String,
      email: String,
      phone: String,
      organization: String,
      socialLink: String,
      message: String,
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

ticketSchema.index({ event: 1, user: 1 }, { unique: true });

export default mongoose.model("Ticket", ticketSchema);
