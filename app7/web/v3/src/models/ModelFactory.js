function ModelFactory(){

}

ModelFactory.prototype.getFrameModel = function(apiRes, options){
	var resParser = new ResponseParser();
	var uiObject = resParser.parse(apiRes);

	var tableModeler = new SalesTableModel();
	var tableModel = tableModeler.getModel(uiObject, options.container);

	var timeModeler = new SalesTimeModel();
	var timeModel = timeModeler.getModel(uiObject, options.timeline);

	var frames = [];
	tableModel.forEach((function(tm){
		frames.push({
			type : tm.tableTitle,
			label : strToFirstUpper(tm.tableTitle, options),
			container : this.getContainer(tm, options),
			timeline : this.getTimeLine(timeModel, tm.tableTitle, options)
		})
	}).bind(this));
	return frames;
}

ModelFactory.prototype.getTimeLine = function(time, type, options){
	var keys = ['key1', 'key2'];
	for(var i = 0 ; i < keys.length ; i++){
		var k = keys[i];
		if( time[0][k].type === type){
			return {
				axes : time[0].axes,
				timeGroups : time[0][k].timeGroups,
				type : type
			}
		}
	}
}

ModelFactory.prototype.getContainer = function(table, options){
	var container = {
		sectors : {
			top : [],
			others : [],
			totalCount : 0,
			othersCount : 0
		}
	};

	var key = table.levels > 1 ? 'columns' : 'cells';
	var allSectors = table[key];
	for(var i = 0 ; i < allSectors.length ; i++){
		if(i < 5){
			container.sectors.top.push({
				key : allSectors[i].key,
				count : allSectors[i].count
			});
		}
		else{
			container.sectors.others.push({
				key : allSectors[i].key,
				count : allSectors[i].count
			});
			container.sectors.othersCount += allSectors[i].count;
		}
		container.sectors.totalCount += allSectors[i].count;
	}
	return container;
}
