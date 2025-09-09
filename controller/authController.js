const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");
const ownerModel = require("../models/owner-model");

module.exports.registerUser = async (req, res) => {
    const { fullname, email, password} = req.body;
    if( fullname.trim() === "" || email.trim() === "" || password.trim() === ""){
        req.flash("Error", "Fields Cannot be Empty");
        return res.redirect("/");
    }
    let existingUser = await userModel.findOne({email});
    if(existingUser){
        req.flash("Error", "User already exists with this email");
        return res.redirect("/");
    } 
    try{
        bcrypt.genSalt(10, async (err, salt) =>{
            bcrypt.hash(password, salt, async (err, hash)=>{
                if(err) return res.status(500).json({msg: "Server Error"});
                let user = await userModel.create({
                    fullname,
                    email,    
                    password: hash
                })
                let token = jwt.sign({id: user._id, email: email}, process.env.JWT_SECRET);
                res.cookie("token", token);
                res.redirect("/shop")
            })
        })
    }
    catch(err){
        console.err("cannot create user", err.message);
    }
}

module.exports.createOwner = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    let existingOwner = await ownerModel.find();
    if (existingOwner.length > 0) {
      req.flash("Error", "Owner already exists and New Owner Cannot be Created");
      return res.redirect("/");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    let user = await ownerModel.create({
      fullname,
      email,
      password: hash,
    });

    let token = jwt.sign({ id: user._id, email: email }, process.env.JWT_SECRET);
    res.cookie("token", token);
    return res.redirect("/owner/shop");

  } catch (err) {
    console.error("Error creating owner:", err);
    return res
      .status(500)
      .json({ success: false, message: err.message });
  }
};

module.exports.loginUser = async (req, res) => {
    let { email, password } = req.body;
    let user = await userModel.findOne({email});
    if(!user) {
        req.flash("Error", "Email Or Password is Incorrect");
        return res.status(400).redirect("/");
    }
    bcrypt.compare(password, user.password, (err, result) => {
        if(err) return res.status(500).json({msg: "Server Error"});
        if(!result) {
            req.flash("Error", "Email Or Password is Incorrect");
            return res.status(400).redirect("/");
        }
        let token = jwt.sign({id: user._id, email: email}, process.env.JWT_SECRET);
        res.cookie("token", token);
        res.redirect("/shop");   
    })
}

module.exports.ownerLogin = async (req, res) => {
    let { email, password } = req.body;
    let user = await ownerModel.findOne({ email });
    if (!user) {
        req.flash("Error", "Email Or Password is Incorrect");
        return res.status(500).redirect("/owner");
    }
    bcrypt.compare(password, user.password, (err, result) => {
        if (err) return res.status(500).json({ msg: "Server Error" });
        if (!result) {
            req.flash("Error", "Email Or Password is Incorrect");
            return res.status(400).redirect("/owner");
        }
        let token = jwt.sign(
            { id: user._id, email: email },
            process.env.JWT_SECRET
        );
        res.cookie("ownerToken", token);
        res.redirect("/owner/shop");
    });
}

module.exports.logoutUser = (req, res) => {
    res.cookie("token", "");
    res.redirect("/");
}

module.exports.logoutOwner = (req, res) => {
    res.cookie("ownerToken", "");
    res.redirect("/owner");
}