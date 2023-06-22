const Store = require("../models/Store");
const filterMiddleware = require("../middleware/filterMiddleware");

module.exports = {
  /*** Get Stores from Database ***/
  getStore: [
    filterMiddleware,
    async (req, res) => {
      try {
        // Access the filtered query from the request object
        const query = req.filteredQuery;

        // Execute the query to fetch the stores
        const stores = await query;

        // Send the response
        res.status(200).json({
          status: "success",
          results: stores.length,
          data: {
            stores,
          },
        });
      } catch (err) {
        res.status(401).json({ status: "fail", message: err.message });
      }
    },
  ],

  //add store
  addStore: async (req, res, next) => {
    const { storeId, address } = req.body;
    const data = {
      storeId,
      address,
    };

    try {
     
      const stores = await Store.create(data);
      res.status(201).json({
        status: "success",
        data: stores,
      });
    } catch (err) {
      res.status(401).json({ status: "fail", message: err.message });
    }
  },
};
