const archtxnController = require("../controllers/archiveTransactionController.js");
const checkAuth = require("../middleware/checkAuth.js");
const express = require("express");
const router = express.Router();

router.post("/txnId/:txnId", checkAuth.checkAuth, (req, res) => {
  archtxnController.create(req, res);
});
router.get(
  "/count/from/:from/to/:to/typeId/:typeId",
  checkAuth.checkAuth,
  (req, res) => {
    archtxnController.countByFromToTypeId(req, res);
  }
);
router.get(
  "/earning/from/:from/to/:to/typeId/:typeId",
  checkAuth.checkAuth,
  (req, res) => {
    archtxnController.earningByFromToTypeId(req, res);
  }
);
router.get(
  "/totalearning/from/:from/to/:to",
  checkAuth.checkAuth,
  (req, res) => {
    archtxnController.totalEarningByFromTo(req, res);
  }
);

module.exports = router;
