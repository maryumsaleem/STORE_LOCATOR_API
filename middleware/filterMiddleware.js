const Store = require('../models/Store');
const filterMiddleware = async (req, res, next) => {
    try {
      // Filteration
      let queryObj = { ...req.query };
      let excludedFields = ['page', 'limit', 'sort', 'fields'];
      excludedFields.forEach((field) => delete queryObj[field]);
  
      // Advance Filtering
      let queryStr = JSON.stringify(queryObj);
      // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
      console.log(JSON.parse(queryStr));
  
      let query = Store.find(JSON.parse(queryStr));
  
      // Sorting
      if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
      } else {
        query = query.sort('-createdAt');
      }
  
      // Fields Limiting
      if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        query = query.select(fields);
      } else {
        query = query.select('-__v');
      }
  
      // Pagination
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 10;
      const skip = (page - 1) * limit;
  
      query = query.skip(skip).limit(limit);
  
      if (req.query.page) {
        const data = await Store.countDocuments();
        if (skip >= data) throw new Error("This page does not exist");
      }
  
      // Add the filtered query to the request object
      req.filteredQuery = query;
  
      // Call the next middleware or route handler
      next();
    } catch (err) {
      res.status(500).json({ status: 'fail', message: err.message });
    }
  };
  
  module.exports = filterMiddleware;
  