const express = require("express")
const router = express.Router()
const ToughtsController = require("../controllers/ToughtController")
const checkAuth = require("../helpers/auth").checkAthu
//Controler

router.get("/add", checkAuth, ToughtsController.createTought)
router.post("/add", checkAuth, ToughtsController.createToughtSave)
router.get("/edit/:id", checkAuth, ToughtsController.updateTought)
router.post("/edit", checkAuth, ToughtsController.updateToughtSave)
router.get("/dashboard", checkAuth, ToughtsController.dashboard)
router.post("/remove", checkAuth, ToughtsController.removeTought)
router.get("/", ToughtsController.showToughts)


module.exports = router
