"use strict";

var productModel = require('../models/productmodel');

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
          } // Render the view with the retrieved products


          res.render("productManagement", {
            Username: req.session.Username,
            Products: products // Pass products array to the view

          });
          console.log("product displayed :", products);
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

var NewProduct = function NewProduct(req, res) {
  return regeneratorRuntime.async(function NewProduct$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          try {
            console.log("entry 1");
            res.render('PdAddForm', {
              Username: req.session.Username
            });
            console.log("ADMIN WILL ADD PRODUCT");
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

var AddProduct = function AddProduct(req, res) {
  var _req$body, name, category, rate, description, stock, offer, discountAmount, catOffer, imageData, imagePaths, i, existingProduct, newProduct;

  return regeneratorRuntime.async(function AddProduct$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          console.log("Check 1 Adding product");
          _req$body = req.body, name = _req$body.name, category = _req$body.category, rate = _req$body.rate, description = _req$body.description, stock = _req$body.stock, offer = _req$body.offer, discountAmount = _req$body.discountAmount, catOffer = _req$body.catOffer; // Check if files were uploaded

          if (!(!req.files || !req.files.length)) {
            _context3.next = 6;
            break;
          }

          console.log("No files were uploaded.");
          return _context3.abrupt("return", res.status(400).send("No files were uploaded."));

        case 6:
          // Extract image data from request
          imageData = req.files;
          console.log(imageData);
          console.log("Name: " + name + " Category: " + category + " rate: " + rate); // Extract image paths

          imagePaths = [];

          for (i = 0; i < imageData.length; i++) {
            imagePaths.push(imageData[i].path.replace(/\\/g, "/").replace("public", "").replace("/admin", "../"));
          }

          console.log("imagePath: ", imagePaths); // Check if product already exists

          _context3.next = 14;
          return regeneratorRuntime.awrap(productModel.findOne({
            name: name
          }));

        case 14:
          existingProduct = _context3.sent;

          if (!existingProduct) {
            _context3.next = 18;
            break;
          }

          req.session.error = "Product already exists, please update its stock";
          return _context3.abrupt("return", res.redirect('/admin/NewProduct'));

        case 18:
          console.log("Check 3"); // Create new product instance

          newProduct = new productModel({
            name: name,
            category: category,
            rate: rate,
            description: description,
            stock: stock,
            image: imagePaths,
            // Assuming 'images' is the field in your schema to store image paths
            offer: offer,
            discountAmount: discountAmount,
            catOffer: catOffer
          }); // Save the new product

          _context3.next = 22;
          return regeneratorRuntime.awrap(newProduct.save());

        case 22:
          console.log("Check 4 added Product:", newProduct);
          return _context3.abrupt("return", res.redirect("/admin/productmanagement?error=success"));

        case 26:
          _context3.prev = 26;
          _context3.t0 = _context3["catch"](0);
          console.error("Error occurred:", _context3.t0);
          res.status(500).send("Error occurred");

        case 30:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 26]]);
};

module.exports = {
  adminProduct: adminProduct,
  NewProduct: NewProduct,
  AddProduct: AddProduct
};