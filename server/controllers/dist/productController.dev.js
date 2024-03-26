"use strict";

var productModel = require('../models/productmodel');

var userDetails = require("../models/userModel");

var multer = require("multer");

var adminProduct = function adminProduct(req, res) {
  var products;
  return regeneratorRuntime.async(function adminProduct$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(productModel.find({}).sort({
            _id: -1
          }));

        case 3:
          products = _context.sent;

          // Find all products and sort by _id in descending order
          if (req.session.prodData) {
            products = req.session.prodData; // If session data exists, use it instead
          }

          res.render("productManagement", {
            Username: req.session.Username,
            Products: products // Pass products array to the view

          });
          console.log(products, "product console");
          _context.next = 13;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          console.error("Error occurred:", _context.t0);
          res.status(500).send("Error occurred");

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var PdAddForm = function PdAddForm(req, res) {
  return regeneratorRuntime.async(function PdAddForm$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          try {
            res.render('PdAddForm', {
              Username: req.session.Username
            });
          } catch (error) {
            console.error("Error occurred:", error);
            res.status(500).send("Error occurred");
          }

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
};

var AddProduct = function AddProduct(req, res) {
  var Prductdetails, imageData, imagePath, i, Product, _AddProduct;

  return regeneratorRuntime.async(function AddProduct$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          console.log("Check 1");
          Prductdetails = req.body;
          imageData = req.files;
          imagePath = [];

          for (i = 0; i < imageData.length; i++) {
            imagePath[i] = imageData[i].path.replace();
          }

          console.log(Prductdetails);
          _context3.next = 9;
          return regeneratorRuntime.awrap(productModel.findOne({
            name: Prductdetails.name
          }));

        case 9:
          Product = _context3.sent;
          console.log("Check 2", Product);

          if (!Product) {
            _context3.next = 15;
            break;
          }

          console.log("Product already exist ,Update thr stock");
          req.session.error = "Product already exist ,Update thr stock";
          return _context3.abrupt("return", res.redirect('/PdAddForm'));

        case 15:
          console.log("Check 3");
          _AddProduct = new productModel({
            name: Prductdetails.name,
            category: Prductdetails.category,
            rate: Prductdetails.rate,
            description: Prductdetails.description,
            stock: Prductdetails.stock,
            image: imagePath,
            offer: Prductdetails.offer,
            discountAmount: Prductdetails.discountAmount,
            catOffer: Prductdetails.catOffer
          });
          _context3.next = 19;
          return regeneratorRuntime.awrap(_AddProduct.save());

        case 19:
          console.log("Check 4");
          res.redirect("/admin/productmanagement");
          _context3.next = 27;
          break;

        case 23:
          _context3.prev = 23;
          _context3.t0 = _context3["catch"](0);
          console.error("Error occurred:", _context3.t0);
          res.status(500).send("Error occurred");

        case 27:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 23]]);
};

module.exports = {
  adminProduct: adminProduct,
  PdAddForm: PdAddForm,
  AddProduct: AddProduct
};