const Store = require("../models/Store");
const geocoder = require("../utils/geocoder");
const dotenv = require("dotenv");
//load env vars
dotenv.config({ path: "./config/config.env" });
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
  
      const data = {
        storeId,
        address,
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

   /*** Get an existing Store ***/
   editStore: async(req,res)=>{
    try {
      let store =  await Store.findById(req.params.id)
      res.status(200).json({
        status:'success', 
        data: {
          store
        }
      })
    } catch (err) {
      res.status(401).json({status:'fail', message: err.message})
    }      
   },
  updateStore: async (req, res) => {
    try {
      const { storeId, address } = req.body;
  
      let store = await Store.findById(req.params.id);
  
      if (!store) {
        return res.status(404).json({ status: 'fail', message: 'Store not found' });
      }
  
      // Update the store details
      store.storeId = storeId || store.storeId;
      store.address = address || store.address;
  
      // Geocode the new address using the MapQuest Geocoding API
      const geocodeResponse = await geocoder.geocode(store.address);
      const { longitude, latitude, formattedAddress } = geocodeResponse[0];
  
      store.location = {
        type: 'Point',
        coordinates: [longitude, latitude],
        formattedAddress: formattedAddress
      };
  
      // Save the updated store
      await store.save();
  
      res.status(200).json({
        status: 'success',
        data: {
          store
        }
      });
    } catch (err) {
      res.status(500).json({ status: 'fail', message: err.message });
    }
  },

  removeStore: async (req, res) => {
    try {
      const store = await Store.findByIdAndDelete(req.params.id);
  
      if (!store) {
        return res.status(404).json({ status: 'fail', message: 'Store not found' });
      }
  
      res.status(200).json({
        status: 'success',
        message: 'Store removed successfully'
      });
    } catch (err) {
      res.status(500).json({ status: 'fail', message: err.message });
    }
  }
  
};
