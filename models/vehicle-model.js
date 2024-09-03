const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  licensePlate: { type: String, required: true },
  make: String,
  model: String,
  year: Number,
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
