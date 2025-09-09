const productModel = require("../models/product-model");

const loginPage = (req, res) => {
    let error = req.flash("Error");
    res.render("owner-login", { error , loggedIn: false});
}

const ownerShop = async (req, res)=>{
    let products = await productModel.find();
    let success = req.flash("success");
    res.render("shop", {products, isOwner:true, success});
}

const ownerRegister = (req, res) => {
    res.render("create-owner", { messages: req.flash() , loggedIn:false});
}

module.exports = {
    loginPage,
    ownerShop,
    ownerRegister
}