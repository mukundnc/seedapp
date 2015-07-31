var express = require('express');
var router = express.Router();
var apiController = require('./../controllers/ApiController');

router.get('/search', apiController.handleSearchRequest.bind(apiController));
router.post('/strategy/save', apiController.handleSaveSalesStrategyRequest.bind(this));
router.get('/strategy/build', apiController.handleBuildSalesIndicesRequest.bind(this));
router.get('/ol', apiController.handleOutlierRequest.bind(apiController));
module.exports = router;