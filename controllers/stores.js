const Store = require("../models/Store");
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
};
