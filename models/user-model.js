const mongoose = require("mongoose");

const userModel = mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    cart: [
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product"
        },
        quantity: {
            type: Number,
            default: 1
        }
    }
    ],
    order:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product"
        }
    ] 
}) 

module.exports = mongoose.model("user", userModel);