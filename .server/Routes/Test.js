require("dotenv").config();
const router = require("express").Router();


// checking email services
router.post("/", async (req, res) => {

    console.log(process.env.DOMAIN, "is server Address")
    res.send("ok")
});


module.exports = router;