var express = require('express');
var router = express.Router();
var apiController = require('./../controllers/ApiController');

router.get('/',  apiController.handleDefaultRequest);
router.get('/search', apiController.handleSearchRequest.bind(apiController));

module.exports = router;