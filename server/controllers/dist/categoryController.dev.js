"use strict";

var categoryModel = require('../models/categorymodel');

var productModel = require('../models/productmodel');

var showCategory = function showCategory(req, res) {
  var listData;
  return regeneratorRuntime.async(function showCategory$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(categoryModel.find({}).sort({
            _id: -1
          }));

        case 3:
          listData = _context.sent;
          res.render("categories", {
            listData: listData,
            Username: req.session.username
          });
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.log("Admin Dashboard error: " + _context.t0);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var addCategoryPage = function addCategoryPage(req, res) {
  return regeneratorRuntime.async(function addCategoryPage$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          try {
            console.log("entry 1");
            res.render('addCategoryPage', {
              Username: req.session.username
            });
            console.log("ADMIN WILL ADD CATEGORY");
          } catch (error) {
            console.error("Error while redirecting the page to add product: ", +error);
            res.status(500).send("Error occurred");
          }

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
};

var addCategory = function addCategory(req, res) {
  var _req$body, category, offer, categoryFound, categorydata;

  return regeneratorRuntime.async(function addCategory$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$body = req.body, category = _req$body.category, offer = _req$body.offer;
          console.log("Category added " + category); // Finding category by name ignoring case

          _context3.next = 5;
          return regeneratorRuntime.awrap(categoryModel.findOne({
            name: {
              $regex: new RegExp(category, "i")
            }
          }));

        case 5:
          categoryFound = _context3.sent;
          console.log(categoryFound);

          if (!categoryFound) {
            _context3.next = 11;
            break;
          }

          return _context3.abrupt("return", res.redirect("/admin/category?err=Category already exists"));

        case 11:
          if (!category) {
            _context3.next = 18;
            break;
          }

          // Creating a new category document
          categorydata = new categoryModel({
            category: category,
            list: 0,
            offer: offer
          }); // Saving the new category document

          _context3.next = 15;
          return regeneratorRuntime.awrap(categorydata.save());

        case 15:
          return _context3.abrupt("return", res.redirect("/admin/categorylist"));

        case 18:
          console.log("Error in addCategory: category is not provided!");

        case 19:
          _context3.next = 24;
          break;

        case 21:
          _context3.prev = 21;
          _context3.t0 = _context3["catch"](0);
          console.log("Error while Admin showing user data: " + _context3.t0);

        case 24:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

module.exports = {
  showCategory: showCategory,
  addCategory: addCategory,
  addCategoryPage: addCategoryPage
};