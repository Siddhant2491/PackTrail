const express = require("express");
const { createOwner , ownerLogin, logoutOwner} = require("../controller/authController");
const productController = require("../controller/productController");
const LoggedInMiddleware = require("../middlewares/isLoggedin");
const ownerController = require("../controller/ownerController");
const upload = require("../middlewares/upload");
const router = express.Router();


router.get("/", ownerController.loginPage);

router.get("/shop", LoggedInMiddleware.ownerLoggedIn, ownerController.ownerShop);

router.get("/register", ownerController.ownerRegister);

router.post("/login", ownerLogin);

router.get("/products", LoggedInMiddleware.ownerLoggedIn, productController.allProducts)

router.get("/products/edit/:id", LoggedInMiddleware.ownerLoggedIn, productController.editProductForm);

router.post("/products/edit/:id", upload.single("image"), productController.editProduct);

router.post("/products/delete/:id", LoggedInMiddleware.ownerLoggedIn, productController.deleteProduct);

router.get("/logout", logoutOwner);

router.post("/create", createOwner);

router.get("/product/form", LoggedInMiddleware.ownerLoggedIn, productController.showForm);

router.post("/products/create", LoggedInMiddleware.ownerLoggedIn, upload.single("image"), productController.createProduct);

module.exports = router;
