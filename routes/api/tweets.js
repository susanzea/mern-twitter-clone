const express = require("express");

//gets a router obj off of the router
const router = express.Router();

router.get("/test", (req, res) => {
    res.json({ msg: "This is the tweet route "})
})


module.exports = router;