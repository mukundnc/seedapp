function OutlierDrillDown(){

}

OutlierDrillDown.prototype.getOutliersForDrillDown = function(drillDownSearchResults, line, cbOnDone){
	cbOnDone(drillDownSearchResults);
}

module.exports = OutlierDrillDown