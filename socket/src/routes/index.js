const { Router } = require("express");

// Seguir agregando lo que falte....

const modelPopUp = require("./popUps.js");

const router = Router();

router.use("/popups", modelPopUp)

module.exports = router;
