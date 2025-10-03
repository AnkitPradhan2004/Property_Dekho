const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  googleId: { type: String, index: true, sparse: true },
  status: { type: String, enum: ["active", "blocked"], default: "active" },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }], // Favourites 
  comparisons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }], // Compairing properties
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);