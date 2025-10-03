const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

messageSchema.index({ property: 1, createdAt: -1 });
messageSchema.index({ from: 1, to: 1, property: 1 });

module.exports = mongoose.model("Message", messageSchema);
