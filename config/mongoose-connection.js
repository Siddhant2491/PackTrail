const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10
        });
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("DB cannot connect:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
