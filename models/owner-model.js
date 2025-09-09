const mongoose = require("mongoose");

const ownerModel = mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product"
        }
    ]
})

module.exports = mongoose.model("owner", ownerModel);
