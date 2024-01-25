require("dotenv").config();
const {shortid, validUrl} = require("../config/imports");
const router = require("../config/router");
const {Users} = require("../models/users");

const BACKEND_URL = process.env.BACKEND_URL;

const generateUrl = () => {
    return shortid.generate();
}

router.post("/", async (req, res) => {

    if(req.body === null){
        return res.status(400).json({ error: 'Missing originalUrl in the request body' });
    }

    if(!validUrl.isUri(req.body.url)){
        return res.status(404).json({ error: "Url Not found" });
    }

    const url = await Users.findOne({ longUrl: req.body.url });

    if(url){
        res.status(200).json({ shortUrl: url.shortUrl });
    }
    else{
        let user = new Users();

        const generatedUrl = generateUrl();

        user.shortUrl = `${BACKEND_URL}${generatedUrl}`;
        user.longUrl = req.body.url;
        user.ipAddress = req.ip;

        try {
            await user.save();
            res.status(200).json({ shortUrl: user.shortUrl });
        }
        catch (error) {
            res.status(500).json({ error: "Could not short Url" });
        }
    }

});

module.exports = router;