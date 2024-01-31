const { upload } = require('../middleware/multer.middleware');
const { createReportController } = require('./report.controller');

const router = require('express').Router()

router.post("/", upload.single("file"), createReportController)



module.exports = router;