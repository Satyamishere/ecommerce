import mongoose, { Schema } from "mongoose";

const viewSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    count:{
        type:Number,
        default:1
    }
  },
  {
    timestamps: true,
  }
);

export const View = mongoose.model("View", viewSchema);