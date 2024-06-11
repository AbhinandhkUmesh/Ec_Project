"use strict";

var categoryModel = require('../models/categorymodel');

var productModel = require('../models/productmodel');

var ObjectId = require('mongoose').Types.ObjectId;

var showCategory = function showCategory(req, res) {
  var page, limit, skip, totalcategory, totalPages, category;
  return regeneratorRuntime.async(function showCategory$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          page = req.query.page || 1; // Get page number from query parameters or default to 1

          limit = 6; // Number of documents per page

          skip = (page - 1) * limit; // Calculate the offset

          _context.next = 6;
          return regeneratorRuntime.awrap(categoryModel.countDocuments({
            category: 0
          }));

        case 6:
          totalcategory = _context.sent;
          // Get total number of users
          totalPages = Math.ceil(totalcategory / limit); // Calculate total pages

          _context.next = 10;
          return regeneratorRuntime.awrap(categoryModel.find({}).sort({
            category: -1
          }).skip(skip).limit(limit));

        case 10:
          category = _context.sent;
          // Fetch users for the current page
          // Extracting any error message from the query parameters
          req.query.err;
          res.render("categories", {
            category: category,
            error: req.query.error,
            Username: req.session.username,
            currentPage: page,
            totalPages: totalPages
          });
          _context.next = 19;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](0);
          console.log("Admin Dashboard error: " + _context.t0);
          res.render('error'); // Render an error page if there's an error

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

var getCategoryPage = function getCategoryPage(req, res) {
  var page, limit, skip, category;
  return regeneratorRuntime.async(function getCategoryPage$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          page = parseInt(req.query.page) || 1; // Current page number, default to 1 if not provided

          limit = 6; // Number of items per page

          skip = (page - 1) * limit; // Number of items to skip based on the current page

          _context2.next = 6;
          return regeneratorRuntime.awrap(categoryModel.find({}).skip(skip).limit(limit).sort({
            category: -1
          }));

        case 6:
          category = _context2.sent;
          res.json(category);
          _context2.next = 14;
          break;

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          console.log("Error fetching users:", _context2.t0);
          res.render('error'); // Render an error page if there's an error

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var addCategoryPage = function addCategoryPage(req, res) {
  return regeneratorRuntime.async(function addCategoryPage$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          try {
            console.log("entry 1");
            res.render('addCategoryPage', {
              Username: req.session.username,
              error: req.query.error
            });
            console.log("ADMIN WILL ADD CATEGORY");
          } catch (error) {
            console.error("Error while redirecting the page to add product: ", +error);
            res.render('error'); // Render an error page if there's an error
          }

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
};

var addCategory = function addCategory(req, res) {
  var _req$body, category, offer, categoryFound, categorydata;

  return regeneratorRuntime.async(function addCategory$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _req$body = req.body, category = _req$body.category, offer = _req$body.offer;
          console.log("Category added ===" + category); // Finding category by name ignoring case

          _context4.next = 5;
          return regeneratorRuntime.awrap(categoryModel.findOne({
            category: {
              $regex: new RegExp(category, "i")
            }
          }));

        case 5:
          categoryFound = _context4.sent;
          console.log(categoryFound);

          if (!categoryFound) {
            _context4.next = 11;
            break;
          }

          return _context4.abrupt("return", res.redirect("/admin/addCategoryPage?error=Category already exists"));

        case 11:
          if (!category) {
            _context4.next = 18;
            break;
          }

          // Creating a new category document
          categorydata = new categoryModel({
            category: category,
            list: 0,
            offer: offer
          }); // Saving the new category document

          _context4.next = 15;
          return regeneratorRuntime.awrap(categorydata.save());

        case 15:
          return _context4.abrupt("return", res.redirect("/admin/categorylist"));

        case 18:
          console.log("Error in addCategory: category is not provided!");

        case 19:
          _context4.next = 25;
          break;

        case 21:
          _context4.prev = 21;
          _context4.t0 = _context4["catch"](0);
          console.log("Error while Admin showing user data: " + _context4.t0);
          res.render('error'); // Render an error page if there's an error

        case 25:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

var categoryEdit = function categoryEdit(req, res) {
  var categoryId, categoryData;
  return regeneratorRuntime.async(function categoryEdit$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          categoryId = req.params.id;
          _context5.next = 4;
          return regeneratorRuntime.awrap(categoryModel.findOne({
            _id: categoryId
          }));

        case 4:
          categoryData = _context5.sent;
          res.render('categoryedit', {
            Username: req.session.Username,
            category: categoryData,
            error: req.query.error
          });
          _context5.next = 12;
          break;

        case 8:
          _context5.prev = 8;
          _context5.t0 = _context5["catch"](0);
          console.error("Error in category edit:", _context5.t0);
          res.render('error'); // Render an error page if there's an error

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var categoryUpdate = function categoryUpdate(req, res) {
  var categoryId, updateData, categoryFound;
  return regeneratorRuntime.async(function categoryUpdate$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          categoryId = req.params.id;
          updateData = req.body;
          console.log(req.body);
          console.log("=======", updateData.category);
          _context6.next = 7;
          return regeneratorRuntime.awrap(categoryModel.findOne({
            category: {
              $regex: new RegExp(updateData.category, "i")
            }
          }));

        case 7:
          categoryFound = _context6.sent;

          if (!categoryFound) {
            _context6.next = 10;
            break;
          }

          return _context6.abrupt("return", res.redirect("/admin/addCategoryPage?error=Category already exists"));

        case 10:
          _context6.next = 12;
          return regeneratorRuntime.awrap(categoryModel.updateOne({
            _id: categoryId
          }, {
            $set: {
              category: updateData.category,
              offer: updateData.offer
            }
          }));

        case 12:
          return _context6.abrupt("return", res.redirect("/admin/categorylist"));

        case 15:
          _context6.prev = 15;
          _context6.t0 = _context6["catch"](0);
          console.error("Error updating product:", _context6.t0);
          res.render('error'); // Render an error page if there's an error

        case 19:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

var categoryStatus = function categoryStatus(req, res) {
  var categoryid, _categoryStatus, updatedStatus;

  return regeneratorRuntime.async(function categoryStatus$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          categoryid = req.params.id;
          _categoryStatus = req.query.status;
          console.log("categoryStatus check1");

          if (!(_categoryStatus === "true")) {
            _context7.next = 11;
            break;
          }

          console.log("ProductStatus check2=========");
          _context7.next = 8;
          return regeneratorRuntime.awrap(categoryModel.updateOne({
            _id: new ObjectId(categoryid)
          }, {
            $set: {
              status: false
            }
          }));

        case 8:
          updatedStatus = _context7.sent;
          _context7.next = 16;
          break;

        case 11:
          console.log("categoryStatus check3 =========");
          console.log(categoryid);
          _context7.next = 15;
          return regeneratorRuntime.awrap(categoryModel.updateOne({
            _id: new ObjectId(categoryid)
          }, {
            $set: {
              status: true
            }
          }));

        case 15:
          updatedStatus = _context7.sent;

        case 16:
          console.log("updatedStatus :", updatedStatus);
          console.log("categoryStatus check4 ========");
          res.redirect('/admin/categorylist');
          _context7.next = 25;
          break;

        case 21:
          _context7.prev = 21;
          _context7.t0 = _context7["catch"](0);
          console.error("Error updating user status:", _context7.t0);
          res.render('error'); // Render an error page if there's an error

        case 25:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

module.exports = {
  showCategory: showCategory,
  addCategory: addCategory,
  addCategoryPage: addCategoryPage,
  getCategoryPage: getCategoryPage,
  categoryEdit: categoryEdit,
  categoryUpdate: categoryUpdate,
  categoryStatus: categoryStatus
};