"use strict";

var productModel = require('../models/productmodel');

var categoryModel = require('../models/categorymodel');

var ObjectId = require('mongoose').Types.ObjectId;

var adminProduct = function adminProduct(req, res) {
  var page, limit, skip, totalcategory, totalPages, products;
  return regeneratorRuntime.async(function adminProduct$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          page = req.query.page || 1; // Get page number from query parameters or default to 1

          limit = 6; // Number of documents per page

          skip = (page - 1) * limit; // Calculate the offset

          _context.next = 6;
          return regeneratorRuntime.awrap(categoryModel.countDocuments({}));

        case 6:
          totalcategory = _context.sent;
          // Get total number of users
          totalPages = Math.ceil(totalcategory / limit); // Calculate total pages

          _context.next = 10;
          return regeneratorRuntime.awrap(productModel.find({}).sort({
            _id: -1
          }).sort({
            name: -1
          }).skip(skip).limit(limit));

        case 10:
          products = _context.sent;

          // Find all products and sort by _id in descending order
          if (req.session.prodData) {
            products = req.session.prodData; // If session data exists, use it instead
          } // Render the view with the retrieved products


          res.render("productManagement", {
            Username: req.session.Username,
            Products: products,
            // Pass products array to the view
            currentPage: page,
            totalPages: totalPages
          });
          console.log("product displayed :", products);
          _context.next = 20;
          break;

        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](0);
          console.error("Error occurred:", _context.t0);
          res.status(500).send("Error occurred");

        case 20:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

var NewProduct = function NewProduct(req, res) {
  var category;
  return regeneratorRuntime.async(function NewProduct$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(categoryModel.find({}).sort({
            name: 1
          }));

        case 2:
          category = _context2.sent;

          try {
            console.log("entry 1");
            res.render('PdAddForm', {
              Username: req.session.Username,
              category: category
            });
            console.log("ADMIN WILL ADD PRODUCT");
          } catch (error) {
            console.error("Error while redirecting the page to add product: ", +error);
            res.status(500).send("Error occurred");
          }

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
};

var AddProduct = function AddProduct(req, res) {
  var _req$body, name, category, rate, description, stock, offer, discountAmount, catOffer, imageData, imagePaths, i, existingProduct, categoryDt, newProduct;

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
            imagePaths.push(imageData[i].path.replace(/\\/g, "/").replace("upload", "").replace("/admin", "/"));
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
          console.log(category, "cAT FID");
          _context3.next = 21;
          return regeneratorRuntime.awrap(categoryModel.find({
            category: category
          }));

        case 21:
          categoryDt = _context3.sent;
          console.log(categoryDt, "Check 3"); // Create new product instance

          newProduct = new productModel({
            name: name,
            category: categoryDt.category,
            rate: rate,
            description: description,
            stock: stock,
            image: [imagePaths],
            // Assuming 'images' is the field in your schema to store image paths
            offer: offer,
            discountAmount: discountAmount,
            catOffer: catOffer
          }); // Save the new product

          _context3.next = 26;
          return regeneratorRuntime.awrap(newProduct.save());

        case 26:
          console.log("Check 4 added Product:", newProduct);
          return _context3.abrupt("return", res.redirect("/admin/productmanagement?error=success"));

        case 30:
          _context3.prev = 30;
          _context3.t0 = _context3["catch"](0);
          console.error("Error occurred:", _context3.t0);
          res.status(500).send("Error occurred");

        case 34:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 30]]);
};

var ProductStatus = function ProductStatus(req, res) {
  var Productid, ProductStatus, updatedStatus;
  return regeneratorRuntime.async(function ProductStatus$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          Productid = req.params.id;
          ProductStatus = req.query.status;

          if (req.session.isAdmin) {
            _context4.next = 4;
            break;
          }

          return _context4.abrupt("return", res.redirect('/admin'));

        case 4:
          _context4.prev = 4;
          console.log("ProductStatus check1");

          if (!(ProductStatus === "true")) {
            _context4.next = 13;
            break;
          }

          console.log("ProductStatus check2=========");
          _context4.next = 10;
          return regeneratorRuntime.awrap(productModel.updateOne({
            _id: new ObjectId(Productid)
          }, {
            $set: {
              status: false
            }
          }));

        case 10:
          updatedStatus = _context4.sent;
          _context4.next = 18;
          break;

        case 13:
          console.log("ProductStatus check3=========");
          console.log(Productid);
          _context4.next = 17;
          return regeneratorRuntime.awrap(productModel.updateOne({
            _id: new ObjectId(Productid)
          }, {
            $set: {
              status: true
            }
          }));

        case 17:
          updatedStatus = _context4.sent;

        case 18:
          console.log("updatedStatus :", updatedStatus);
          console.log("ProductStatus check4========");
          res.redirect('/admin/productmanagement');
          _context4.next = 27;
          break;

        case 23:
          _context4.prev = 23;
          _context4.t0 = _context4["catch"](4);
          console.error("Error updating user status:", _context4.t0);
          res.status(500).send("Internal Server Error");

        case 27:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[4, 23]]);
};

module.exports = {
  adminProduct: adminProduct,
  NewProduct: NewProduct,
  AddProduct: AddProduct,
  ProductStatus: ProductStatus
};