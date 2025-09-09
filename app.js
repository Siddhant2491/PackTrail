const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");
const session = require("express-session");
const flash = require("connect-flash");
const connectDB = require("./config/mongoose-connection");
const userModel = require("./models/user-model");
const ownerModel = require("./models/owner-model");
const indexRoutes = require("./routes/index");
const usersRoutes = require("./routes/usersRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const cookieParser = require("cookie-parser");
require("dotenv").config();
connectDB();

app.use(
  session({
    secret: "your_secret_key", // 🔒 replace with a strong secret (store in .env)
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRoutes);
app.use("/users", usersRoutes);
app.use("/owner", ownerRoutes);
app.set("view engine", "ejs");

app.listen(process.env.PORT || 3000, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})