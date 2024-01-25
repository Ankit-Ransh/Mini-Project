const { mongoose } = require("./imports");

const main = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/tinyLinkr");
        console.log("Connect to MongoDB successfully");
    } catch (error) {
        console.log("Connect failed " + error.message )
    }
}

module.exports = {
    main,mongoose
};