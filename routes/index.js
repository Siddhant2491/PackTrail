const express = require('express');
const productModel = require("../models/product-model");
const { userLoggedIn, ownerLoggedIn } = require("../middlewares/isLoggedin");
const userModel = require('../models/user-model');
const router = express.Router();

router.get("/", (req, res) => {
    let error = req.flash("Error");
    res.render("index", {error, loggedIn:false});
});

router.get("/shop", userLoggedIn, async (req, res) => {
    let success = req.flash("success");
    let products = await productModel.find();
    res.render("shop", {products, success});
});

router.get('/addtocart/:productId', userLoggedIn, async (req, res) => {
    const user = await userModel.findOne({ email: req.user.email });

    const cartItem = user.cart.find(item => item.product.toString() === req.params.productId);

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        user.cart.push({
            product: req.params.productId,
            quantity: 1
        });
    }

    await user.save();
    req.flash("success", "Added To Cart");
    res.redirect("/shop");
});

router.post("/cart/increase/:productId", userLoggedIn, async (req, res) => {
    const user = await userModel.findOne({ email: req.user.email });

    const cartItem = user.cart.find(item => item.product.toString() === req.params.productId);
    if (cartItem) {
        cartItem.quantity += 1;
    }

    await user.save();
    res.redirect("/cart");
});


router.post("/cart/decrease/:productId", userLoggedIn, async (req, res) => {
    const user = await userModel.findOne({ email: req.user.email });

    const cartIndex = user.cart.findIndex(item => item.product.toString() === req.params.productId);
    if (cartIndex > -1) {
        if (user.cart[cartIndex].quantity > 1) {
            user.cart[cartIndex].quantity -= 1;
        } else {
            user.cart.splice(cartIndex, 1);
        }
    }

    await user.save();
    res.redirect("/cart");
});



router.get("/cart", userLoggedIn, async (req, res)=>{
    let user = await userModel.findOne({ email: req.user.email }).populate("cart.product");
    res.render("cart", {user});
})

module.exports = router;