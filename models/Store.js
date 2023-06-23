const mongoose = require("mongoose");
const geocoder = require("../utils/geocoder");

const StoreSchema = new mongoose.Schema({
  storeId: {
    type: String,
    required: [true, "Please add a store ID."],
    unique: true,
    maxlength: [10, "Store ID must be less than 10 characters"],
  },
  address: {
    type: String,
    required: [true, "Please add an address."],
  },
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
    },
    coordinates: {
      type: [Number],
      //2dsphere supports queries that calculate geometries on an earth like sphere
      index: "2dsphere",
    },
    formattedAddress: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

//Geocode & create location
StoreSchema.pre('save', async function (next) {
  if (!this.isModified('address')) {
    // If the 'address' field is not modified, skip the geocoding process
    return next();
  }

  try {
    const loc = await geocoder.geocode(this.address);
    this.location = {
      type: 'Point',
      coordinates: [loc[0].longitude, loc[0].latitude],
      formattedAddress: loc[0].formattedAddress
    };

    next();
  } catch (error) {
    next(error);
  }
});


module.exports = mongoose.model("Store", StoreSchema);
