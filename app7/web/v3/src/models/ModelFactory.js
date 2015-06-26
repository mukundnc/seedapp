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
			var yAxis = {
				labels : time[0].axes.y[k].labels,
				yScale : time[0].axes.y[k].yScale,
				xStart : time[0].axes.y.xStart,
				yStart : time[0].axes.y.yStart,
				xEnd : time[0].axes.y.xEnd,
				yEnd : time[0].axes.y.yEnd,
			}
			return {
				axes :{
					x :  time[0].axes.x,
					y :  yAxis
				},
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
		},
		type : table.tableTitle
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

ModelFactory.prototype.getCompareFrameModel = function(apiRes, options){	
	var meta = this.getCompareModelMeta(apiRes, options);
	var compareFrame = this.getCompareModelTmpl();
	var regionTypes = ['regions', 'states', 'cities', 'region', 'state', 'city'];
	var productTypes = ['categories', 'types', 'brands', 'models', 'category', 'type', 'brand', 'model'];

	function isProductType(p){
		return productTypes.indexOf(p) !== -1;
	}

	function isRegionType(t){
		return regionTypes.indexOf(t) !== -1;
	}

	for(var i = 0 ; i < meta.frames.length; i += meta.tabCount){
		compareFrame.label = meta.frames[i].label;
		compareFrame.type = meta.frames[i].type;		
		if(isProductType(compareFrame.type)){
			compareFrame.container.sectors.top.push({
				key : meta.qSources.pop().value,
				count : meta.frames[i].container.sectors.totalCount	
			});
		}
		else{
			var fs = meta.frames[i].container.sectors.top.concat(meta.frames[i].container.sectors.others);
			compareFrame.container.sectors.top = compareFrame.container.sectors.top.concat(fs);
		}
	}
	compareFrame.container.sectors.top = _.sortBy(compareFrame.container.sectors.top, function(d){ return d.count; }).reverse();
	if(compareFrame.container.sectors.top.length > 5){
		compareFrame.container.sectors.others = compareFrame.container.sectors.top.splice(5, compareFrame.container.sectors.top.length - 5);
	}
	compareFrame.container.sectors.others.forEach(function(o){
		compareFrame.container.sectors.othersCount += o.count;
	});
	compareFrame.container.sectors.totalCount = compareFrame.container.sectors.othersCount;
	compareFrame.container.sectors.top.forEach(function(t){
		compareFrame.container.sectors.totalCount += t.count;
	});
	console.log(compareFrame);
	return compareFrame;
}

ModelFactory.prototype.getCompareModelMeta = function(apiRes, options){
	var resultsCount = apiRes.results.length;
	var aRes = { results : [apiRes.results[0]] };
	var framesFirst = this.getFrameModel(aRes, options);
	var tabCount = framesFirst.length;
	aRes.results = apiRes.results.slice(1);
	var framesRest = this.getFrameModel(aRes, options);
	var frames = framesFirst.concat(framesRest);
	console.log(frames);
	var qSources = [];
	var qTargets = [];
	apiRes.results.forEach(function(r){
		if(r.qSource)
			qSources.push(r.qSource);
		if(r.qTarget)
			qTargets.push(r.qTarget);
	});
	qSources.reverse();
	qTargets.reverse();
	return {
		resultsCount : resultsCount,
		tabCount : tabCount,
		frames : frames,
		qSources : qSources,
		qTargets : qTargets
	}
}

ModelFactory.prototype.getCompareModelTmpl = function(){
	return {
		type : '',
		label : '',
		container : {
			sectors : {
				top : [],
				others : [],
				totalCount : 0,
				othersCount : 0,
				type : ''
			}
		},
		timeline : {
			axes : {},
			timeGroups : [],
			type : ''
		}
	}
}



