const Store = require("../models/Store");
const dotenv = require("dotenv");
//load env vars
dotenv.config({ path: "./config/config.env" });
const axios = require('axios');
//const filterMiddleware = require("../middleware/filterMiddleware");
const ApiFeatures = require("../utils/apiFeatures")

module.exports = {
  /*** Get Stores from Database ***/
  getStore: async (req, res) => {
    try {
      // Create a new instance of ApiFeatures with the query and queryString parameters
      const features = new ApiFeatures(Store.find(), req.query);

      // Apply the necessary methods for filtering, pagination, sorting, and limiting fields
      const filteredFeatures = features.filter().Paginate().sort().LimitFields();

      // Execute the modified query
      const stores = await filteredFeatures.query;

      res.status(200).json({
        status: 'success',
        results: stores.length,
        data: {
          stores
        }
      });
    } catch (err) {
      res.status(401).json({ status: 'fail', message: err.message });
    }
  },

  //add store

  addStore: async (req, res, next) => {
    try {
      const { storeId, address } = req.body;
  
      // Geocode the address using the MapQuest Geocoding API
      const geocodeResponse = await axios.get(
        `https://www.mapquestapi.com/geocoding/v1/address?key=${process.env.GEOCODER_API_KEY}&location=${encodeURIComponent(address)}`
      );
  
      const { results } = geocodeResponse.data;
      const { lat, lng } = results[0].locations[0].latLng;
  
      const data = {
        storeId,
        address,
        location: {
          type: 'Point', 
          coordinates: [lng, lat]
        }
      };
  
      const stores = await Store.create(data);
      return res.status(201).json({
        status: 'success',
        data: stores
      });
    } catch (err) {
      res.status(401).json({ status: 'fail', message: err.message });
    }
  },


  
};
