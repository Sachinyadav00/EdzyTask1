const express = require("express");
 
const router = express.Router();

router.get("/urlsinsideme", urlsInsideMe);
router.get("/urllinkedtome", urlLinkedToMe);

module.exports = router;
