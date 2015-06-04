var express = require('express');
var router = express.Router();
var apiController = require('./../controllers/ApiController');

router.get('/',  apiController.handleDefaultRequest);
router.get('/search', apiController.handleSearchRequest.bind(apiController));
router.post('/v1/save', apiController.handleSaveRequest_v1.bind(this));

module.exports = router;