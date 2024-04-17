"use strict";

var productModel = require('../models/productmodel');

var categoryModel = require('../models/categorymodel');

var productData = require('../models/productmodel');

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
          }).skip(skip).limit(limit).populate('category'));

        case 10:
          products = _context.sent;

          // Find all products and sort by _id in descending order
          if (req.session.prodData) {
            products = req.session.prodData; // If session data exists, use it instead
          } // Render the view with the retrieved products


          res.render("productManagement", {
            Username: req.session.Username,
            products: products,
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

var getproductPage = function getproductPage(req, res) {
  var page, limit, skip, users;
  return regeneratorRuntime.async(function getproductPage$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          page = parseInt(req.query.page) || 1; // Current page number, default to 1 if not provided

          limit = 6; // Number of items per page

          skip = (page - 1) * limit; // Number of items to skip based on the current page

          _context2.next = 6;
          return regeneratorRuntime.awrap(userModel.find({
            isAdmin: 0
          }).skip(skip).limit(limit).sort({
            Username: -1
          }));

        case 6:
          users = _context2.sent;
          res.json(users);
          _context2.next = 14;
          break;

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          console.log("Error fetching users:", _context2.t0);
          res.status(500).json({
            error: "Internal Server Error"
          });

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var NewProduct = function NewProduct(req, res) {
  var category;
  return regeneratorRuntime.async(function NewProduct$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(categoryModel.find({}).sort({
            name: 1
          }));

        case 2:
          category = _context3.sent;

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
          return _context3.stop();
      }
    }
  });
};

var AddProduct = function AddProduct(req, res) {
  var _req$body, name, category, rate, description, stock, offer, discountAmount, catOffer, files, images, existingProduct, newProduct;

  return regeneratorRuntime.async(function AddProduct$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          console.log("Check 1 Adding product");
          _req$body = req.body, name = _req$body.name, category = _req$body.category, rate = _req$body.rate, description = _req$body.description, stock = _req$body.stock, offer = _req$body.offer, discountAmount = _req$body.discountAmount, catOffer = _req$body.catOffer;
          console.log(req.body); // // Check if files were uploaded

          if (!(!req.files || !req.files.length)) {
            _context4.next = 7;
            break;
          }

          console.log("No files were uploaded.");
          return _context4.abrupt("return", res.status(400).send("No files were uploaded."));

        case 7:
          // // Extract image data from request
          // const imageData = req.files
          console.log("Name: " + name + " Category: " + category + " rate: " + rate); // // Extract image paths
          // const imagePaths = [];
          // for (let i = 0; i < imageData.length; i++) {
          //     imagePaths.push(imageData[i].path
          //         .replace(/\\/g, "/")
          //         .replace("upload", "")
          //         .replace("/admin", "/"));
          // }
          // console.log("imagePath: ", imagePaths)

          files = req.files;
          images = [];
          files.forEach(function (files) {
            var image = files.filename;
            images.push(image);
          }); // Check if product already exists

          _context4.next = 13;
          return regeneratorRuntime.awrap(productModel.findOne({
            name: name
          }));

        case 13:
          existingProduct = _context4.sent;

          if (!existingProduct) {
            _context4.next = 17;
            break;
          }

          req.session.error = "Product already exists, please update its stock";
          return _context4.abrupt("return", res.redirect('/admin/NewProduct'));

        case 17:
          console.log(category, "cAT FID"); // // Create new product instance

          newProduct = new productModel({
            name: name,
            category: category,
            rate: rate,
            description: description,
            stock: stock,
            image: images,
            // Assuming 'images' is the field in your schema to store 
            offer: offer,
            discountAmount: discountAmount,
            catOffer: catOffer
          }); // // Save the new product

          _context4.next = 21;
          return regeneratorRuntime.awrap(newProduct.save());

        case 21:
          console.log("Check 4 added Product:", newProduct);
          return _context4.abrupt("return", res.redirect("/admin/productmanagement?error=success"));

        case 25:
          _context4.prev = 25;
          _context4.t0 = _context4["catch"](0);
          console.error("Error occurred:", _context4.t0);
          res.status(500).send("Error occurred");

        case 29:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 25]]);
};

var ProductStatus = function ProductStatus(req, res) {
  var Productid, ProductStatus, updatedStatus;
  return regeneratorRuntime.async(function ProductStatus$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          Productid = req.params.id;
          ProductStatus = req.query.status;

          if (req.session.isAdmin) {
            _context5.next = 4;
            break;
          }

          return _context5.abrupt("return", res.redirect('/admin'));

        case 4:
          _context5.prev = 4;
          console.log("ProductStatus check1");

          if (!(ProductStatus === "true")) {
            _context5.next = 13;
            break;
          }

          console.log("ProductStatus check2=========");
          _context5.next = 10;
          return regeneratorRuntime.awrap(productModel.updateOne({
            _id: new ObjectId(Productid)
          }, {
            $set: {
              status: false
            }
          }));

        case 10:
          updatedStatus = _context5.sent;
          _context5.next = 18;
          break;

        case 13:
          console.log("ProductStatus check3 =========");
          console.log(Productid);
          _context5.next = 17;
          return regeneratorRuntime.awrap(productModel.updateOne({
            _id: new ObjectId(Productid)
          }, {
            $set: {
              status: true
            }
          }));

        case 17:
          updatedStatus = _context5.sent;

        case 18:
          console.log("updatedStatus :", updatedStatus);
          console.log("ProductStatus check4 ========");
          res.redirect('/admin/productmanagement');
          _context5.next = 27;
          break;

        case 23:
          _context5.prev = 23;
          _context5.t0 = _context5["catch"](4);
          console.error("Error updating user status:", _context5.t0);
          res.status(500).send("Internal Server Error");

        case 27:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[4, 23]]);
};

var productEdit = function productEdit(req, res) {
  var productId, _productData, categoryData;

  return regeneratorRuntime.async(function productEdit$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          console.log("Entered productEdit");
          _context6.prev = 1;
          productId = req.params.id;
          console.log("===========", productId); // Corrected variable name

          _context6.next = 6;
          return regeneratorRuntime.awrap(productModel.findOne({
            _id: productId
          }));

        case 6:
          _productData = _context6.sent;
          console.log("Product Data:", _productData);
          _context6.next = 10;
          return regeneratorRuntime.awrap(categoryModel.find({}));

        case 10:
          categoryData = _context6.sent;
          res.render('productedit', {
            Username: req.session.Username,
            product: _productData,
            category: categoryData
          });
          _context6.next = 18;
          break;

        case 14:
          _context6.prev = 14;
          _context6.t0 = _context6["catch"](1);
          console.error("Error in Product edit:", _context6.t0);
          res.status(500).send("Internal Server Error");

        case 18:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[1, 14]]);
};

var productupdate = function productupdate(req, res) {
  var productID, updateData, files, images, dataUpload, imageUpload;
  return regeneratorRuntime.async(function productupdate$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          productID = req.params.id;
          updateData = req.body;
          console.log(req.body);
          console.log("=++++++++", productID);
          console.log("=++++====++++", updateData);
          files = req.files;
          images = [];
          files.forEach(function (files) {
            var image = files.filename;
            images.push(image);
          });
          console.log("=++++++----++", images);
          _context7.next = 12;
          return regeneratorRuntime.awrap(productModel.updateOne({
            _id: productID
          }, {
            $set: {
              name: updateData.name,
              category: updateData.category,
              rate: updateData.rate,
              description: updateData.description,
              stock: updateData.stock,
              offer: updateData.offer,
              discountAmount: updateData.discountAmount,
              catOffer: updateData.catOffer
            }
          }));

        case 12:
          dataUpload = _context7.sent;
          _context7.next = 15;
          return regeneratorRuntime.awrap(productModel.updateOne({
            _id: productID
          }, {
            $push: {
              image: {
                $each: images
              }
            }
          }));

        case 15:
          imageUpload = _context7.sent;
          console.log(dataUpload, "----===++===---");
          console.log(imageUpload, "----======---");
          res.redirect("/admin/productmanagement");
          _context7.next = 25;
          break;

        case 21:
          _context7.prev = 21;
          _context7.t0 = _context7["catch"](0);
          console.error("Error updating product:", _context7.t0);
          res.status(500).send("Internal Server Error");

        case 25:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

var productImageDelete = function productImageDelete(req, res) {
  var productID, imagePath, imageDelete;
  return regeneratorRuntime.async(function productImageDelete$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          productID = req.params.id;
          imagePath = req.query.index;
          _context8.next = 5;
          return regeneratorRuntime.awrap(productModel.updateOne({
            _id: productID
          }, {
            $pull: {
              image: imagePath
            }
          }));

        case 5:
          imageDelete = _context8.sent;
          console.log(imageDelete);
          res.redirect("/admin/productEdit/".concat(productID));
          _context8.next = 14;
          break;

        case 10:
          _context8.prev = 10;
          _context8.t0 = _context8["catch"](0);
          console.error("Error updating product:", _context8.t0);
          res.status(500).send("Internal Server Error");

        case 14:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

module.exports = {
  adminProduct: adminProduct,
  NewProduct: NewProduct,
  AddProduct: AddProduct,
  ProductStatus: ProductStatus,
  getproductPage: getproductPage,
  productEdit: productEdit,
  productupdate: productupdate,
  productImageDelete: productImageDelete
};