const ownerModel = require("../models/owner-model");
const productModel = require("../models/product-model");
const Product = require("../models/product-model");

const showForm = (req, res) => {
    let success = req.flash("Success");
    res.render("createproducts", { success, isOwner:true});
};

const createProduct = async (req, res) => {
    try {
        const { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

        if (!req.file) {
            req.flash("Success", "Please upload an image.");
            return res.redirect("/owner/product/form");
        }

        const newProduct = new Product({
            image: req.file.buffer, 
            name,
            price: parseFloat(price),
            discount: parseFloat(discount) || 0,
            bgcolor,
            panelcolor,
            textcolor,
        });

        await newProduct.save();

        let owner = await ownerModel.findOne();

        owner.products.push(newProduct._id);
        await owner.save();

        req.flash("Success", "Product created successfully!");
        res.redirect("/owner/product/form");
    } catch (err) {
        console.error(err);
        req.flash("Success", "Something went wrong.");
        res.redirect("/owner/product/form");
    }
};

const allProducts = async (req, res)=>{
    let owner = await ownerModel.findOne().populate("products");
    res.render("products", {isOwner:true, owner});
}

const editProductForm = async (req, res) => {
    const product = await productModel.findById(req.params.id);
    res.render("updateProduct", { product , isOwner:true});
}

const editProduct = async (req, res) => {
    const product = await productModel.findById(req.params.id);

    product.name = req.body.name;
    product.price = req.body.price;
    product.discount = req.body.discount;
    product.bgcolor = req.body.bgcolor;
    product.panelcolor = req.body.panelcolor;
    product.textcolor = req.body.textcolor;

    if (req.file) {
        product.image = req.file.buffer;
    }

    await product.save();
    res.redirect("/owner/products");
}

const deleteProduct = async (req, res) => {
    const productId = req.params.id;

    await ownerModel.updateOne(
        { email: req.user.email },
        { $pull: { products: productId } }
    );

    await productModel.findByIdAndDelete(productId);
    res.redirect("/owner/products");
}

module.exports = {
    showForm,
    createProduct,
    allProducts,
    editProductForm,
    editProduct,
    deleteProduct
}