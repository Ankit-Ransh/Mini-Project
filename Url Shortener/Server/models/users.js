const { mongoose } = require("../config/imports");
const {main} = require("../config/mongoose");

main().catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
    shortUrl: String,
    longUrl: String,
    ipAddress: String,
});

const Users = new mongoose.model("Users", userSchema);

module.exports = {
    Users: Users,
};

