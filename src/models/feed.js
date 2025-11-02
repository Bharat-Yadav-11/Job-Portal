import mongoose from "mongoose";

const FeedSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  images: {
    type: [String],
    required: true,
  },
  likes: {
    type: Array,
    default: [],
  },

}, { timestamps: true });

export default mongoose.models.Feed || mongoose.model("Feed", FeedSchema);