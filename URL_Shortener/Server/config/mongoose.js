require("dotenv").config();
const { mongoose } = require("./imports");

const MONGO_URL = process.env.MONGO_URL;

const main = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connect to MongoDB successfully");
    } catch (error) {
        console.log("Connect failed " + error.message )
    }
}

module.exports = {
    main,mongoose
};