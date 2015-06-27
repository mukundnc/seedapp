function ModelFactory(){
	this.compareQueryContext = {
		multi_container : 1,
		multi_container_in_multi_container : 2,
		multi_container_in_container : 3,
		multi_container_in_leaf : 4,
		multi_container_in_multi_leaf : 5,
		container_in_multi_container : 6,
		container_in_multi_leaf : 7,	
		leaf_in_multi_container : 8,
		leaf_in_multi_leaf : 9,
		multi_leaf : 10,
		multi_leaf_in_multi_container : 11,
		multi_leaf_in_container : 12,
		multi_leaf_in_multi_leaf : 13	
	}
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
	var qfc = this.getQueryItemsFramesAndContext(apiRes, options);
	var compareModel = {};
	switch(qfc.compareQueryContext.context){
		case this.compareQueryContext.multi_container :
			compareModel = this.getMultiContainerModel(qfc.frames, qfc.compareQueryContext);
			break;
		case this.compareQueryContext.multi_container_in_multi_container :
			compareModel = this.getMultiContainerInMultiContainerModel(qfc.frames, qfc.compareQueryContext);
			break;
		case this.compareQueryContext.multi_container_in_container :
			compareModel = this.getMultiContainerInContainerModel(qfc.frames, qfc.compareQueryContext);
			break;
		case this.compareQueryContext.multi_container_in_leaf :
			compareModel = this.getMultiContainerInLeafModel(qfc.frames, qfc.compareQueryContext);
			break;
		case this.compareQueryContext.multi_container_in_multi_leaf :
			compareModel = this.getMultiContainerInMultiLeafModel(qfc.frames, qfc.compareQueryContext);
			break;
		case this.compareQueryContext.container_in_multi_container :
			compareModel = this.getContainerInMultiContainer(qfc.frames, qfc.compareQueryContext);
			break;
		case this.compareQueryContext.container_in_multi_leaf :
			compareModel = this.getContainerInMultiLeafModel(qfc.frames, qfc.compareQueryContext);
			break;
		case this.compareQueryContext.leaf_in_multi_container :
			compareModel = this.getLeafInMultiContainerModel(qfc.frames, qfc.compareQueryContext);
			break;
		case this.compareQueryContext.leaf_in_multi_leaf :
			compareModel = this.getLeafInMultiLeafModel(qfc.frames, qfc.compareQueryContext);
			break;
		case this.compareQueryContext.multi_leaf :
			compareModel = this.getMultiLeafModel(qfc.frames, qfc.compareQueryContext);
			break;
		case this.compareQueryContext.multi_leaf_in_multi_container :
			compareModel = this.getMultiLeafInMultiContainerModel(qfc.frames, qfc.compareQueryContext);
			break;
		case this.compareQueryContext.multi_leaf_in_container :
			compareModel = this.getMultiLeafInContainerModel(qfc.frames, qfc.compareQueryContext);
			break;
		case this.compareQueryContext.multi_leaf_in_multi_leaf :
			compareModel = this.getMultiLeafInMultiLeafModel(qfc.frames, qfc.compareQueryContext);
			break;	
	}
	return compareModel;
}

ModelFactory.prototype.getQueryItemsFramesAndContext = function(apiRes, options){	
	var compareQueryContext = this.getCompareQueryContext(apiRes, options);
	var frames = this.getFrameModel(apiRes, options);
	var popFrequency = this.getPopFequency(compareQueryContext)
	frames.reverse();
	var queryVsFrames = {};
	var refSources = compareQueryContext.qSources.length >= compareQueryContext.qTargets.length ? 
														   compareQueryContext.qSources : compareQueryContext.qTargets;
	refSources.forEach(function(refSource){
		queryVsFrames[refSource.value] = [];
		for(var i = 0 ; i < popFrequency ; i++){
			queryVsFrames[refSource.value].push(frames.pop());
		}
	});

	console.log(queryVsFrames);
	return {
		frames : queryVsFrames,
		compareQueryContext : compareQueryContext
	}
}

ModelFactory.prototype.getCompareQueryContext = function(apiRes, options){
	var qSources = [];
	var qTargets = [];
	var context = 0;
	var isqSourceContainer = false;
	var isqTargetContainer = false;

	apiRes.results.forEach(function(r){
		if(r.qSource) {
			if(_.where(qSources, {value : r.qSource.value}).length === 0)
				qSources.push(r.qSource);
		}
		if(r.qTarget) {
			if(_.where(qTargets, {value : r.qTarget.value}).length === 0)
				qTargets.push(r.qTarget);
		}
	});
	function isContainerType(t){
		var leaves = ['cities', 'city', 'models', 'model'];
		return _.contains(leaves, t) === false;
	}
	if(qTargets.length === 0){
		context = isContainerType(qSources[0].key) ? this.compareQueryContext.multi_container : this.compareQueryContext.multi_leaf;
	}
	else{
		isqSourceContainer = isContainerType(qSources[0].key);
		isqTargetContainer = isContainerType(qTargets[0].key);
		if(qSources.length > 1){
			if(qTargets.length > 1){
				if(isqSourceContainer && isqTargetContainer)
					context = this.compareQueryContext.multi_container_in_multi_container;
				else if(isqSourceContainer && !isqTargetContainer)
					context = this.compareQueryContext.multi_container_in_multi_leaf;
				else if(!isqSourceContainer && isqTargetContainer)
					context = this.compareQueryContext.multi_leaf_in_multi_container;
				else if(!isqSourceContainer && !isqTargetContainer)
					context = this.compareQueryContext.multi_leaf_in_multi_leaf;
			}
			else{
				if(isqSourceContainer && isqTargetContainer)
					context = this.compareQueryContext.multi_container_in_container;
				if(isqSourceContainer && !isqTargetContainer)
					context = this.compareQueryContext.multi_container_in_leaf;
				if(!isqSourceContainer && !isqTargetContainer)
					context = this.compareQueryContext.multi_leaf_in_leaf;
				if(!isqSourceContainer && isqTargetContainer)
					context = this.compareQueryContext.multi_leaf_in_container;
			}
		}
		else{
			if(qTargets.length > 1){
				if(isqSourceContainer && isqTargetContainer)
					context = this.compareQueryContext.container_in_multi_container;
				else if(isqSourceContainer && !isqTargetContainer)
					context = this.compareQueryContext.container_in_multi_leaf;
				else if(!isqSourceContainer && isqTargetContainer)
					context = this.compareQueryContext.leaf_in_multi_container;
				else if(!isqSourceContainer && !isqTargetContainer)
					context = this.compareQueryContext.leaf_in_multi_leaf;
			}
		}
	}
	return {
		qSources : qSources,
		qTargets : qTargets,
		context : context,
		isqSourceContainer : isqSourceContainer,
		isqTargetContainer : isqTargetContainer
	}
}

ModelFactory.prototype.getPopFequency = function(compareQueryContext){
	var qSCount = compareQueryContext.qSources.length;
	var qTCount = compareQueryContext.qTargets.length;
	var frequency = 0;

	switch(compareQueryContext.context){
		case this.compareQueryContext.multi_container :
			frequency = 2;
			break;
		case this.compareQueryContext.multi_container_in_multi_container :
			frequency = 2 * qTCount;
			break;
		case this.compareQueryContext.multi_container_in_container :
			frequency = 2;
			break;
		case this.compareQueryContext.multi_container_in_leaf :
			frequency = 1;
			break;
		case this.compareQueryContext.multi_container_in_multi_leaf :
			frequency = qTCount;
			break;
		case this.compareQueryContext.container_in_multi_container :
			frequency = 2;
			break;
		case this.compareQueryContext.container_in_multi_leaf :
			frequency = 1;
			break;
		case this.compareQueryContext.leaf_in_multi_container :
			frequency = 1;
			break;
		case this.compareQueryContext.leaf_in_multi_leaf :
			frequency = 0;
			break;
		case this.compareQueryContext.multi_leaf :
			frequency = 1;
			break;
		case this.compareQueryContext.multi_leaf_in_multi_container :
			frequency = 2;
			break;
		case this.compareQueryContext.multi_leaf_in_container :
			frequency = 1;
			break;
		case this.compareQueryContext.multi_leaf_in_multi_leaf :
			frequency = 0;
			break;	
	}
	return frequency;
}











ModelFactory.prototype.getMultiContainerModel = function (frames, compareQueryContext){
}

ModelFactory.prototype.getMultiContainerInMultiContainerModel = function (frames, compareQueryContext){
}

ModelFactory.prototype.getMultiContainerInContainerModel = function (frames, compareQueryContext){
}

ModelFactory.prototype.getMultiContainerInLeafModel = function (frames, compareQueryContext){
}

ModelFactory.prototype.getMultiContainerInMultiLeafModel = function (frames, compareQueryContext){
}

ModelFactory.prototype.getContainerInMultiContainer = function (frames, compareQueryContext){
}

ModelFactory.prototype.getContainerInMultiLeafModel = function (frames, compareQueryContext){
}

ModelFactory.prototype.getLeafInMultiContainerModel = function (frames, compareQueryContext){
}

ModelFactory.prototype.getLeafInMultiLeafModel = function (frames, compareQueryContext){
}

ModelFactory.prototype.getMultiLeafModel = function (frames, compareQueryContext){
}

ModelFactory.prototype.getMultiLeafInMultiContainerModel = function (frames, compareQueryContext){
}

ModelFactory.prototype.getMultiLeafInContainerModel = function (frames, compareQueryContext){
}

ModelFactory.prototype.getMultiLeafInMultiLeafModel = function (frames, compareQueryContext){
}


