const router = require("../config/router");
const { Users } = require("../models/users");

const BACKEND_URL = process.env.BACKEND_URL;

router.get("/:id", async (req,res) => {
    const shortUrl = req.params.id;

    const isUser = await Users.findOne({ shortUrl: `${BACKEND_URL}${shortUrl}` });
    console.log(isUser);
    if(isUser){
        res.status(200).redirect(isUser.longUrl);
    }
    else{
        res.status(404).json({ error: "Url Not found" });
    }

})

module.exports = router;