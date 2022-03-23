const express = require('express');
const router = express.Router();
const ProjectController= require("../controller/controller")

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/functionup/colleges",ProjectController.college)
router.post("/functionup/interns",ProjectController.intern)
router.get("/getcollegeName",ProjectController.getcollege)

module.exports = router;