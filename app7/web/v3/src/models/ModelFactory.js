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
		type : table.tableTitle,
		queryDetails : table.queryDetails
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
	console.log(compareModel);
	return compareModel;
}

ModelFactory.prototype.getQueryItemsFramesAndContext = function(apiRes, options){	
	var compareQueryContext = this.getCompareQueryContext(apiRes, options);
	var frames = this.getCompareModels(apiRes, options);
	var queryVsFrames = {};
	compareQueryContext.qSources.forEach(function(qSource){
		queryVsFrames[qSource.value] = [];
		for(var i = 0 ; i < frames.length ; i++){
			var qDetails = frames[i].container.queryDetails;
			if(qDetails.qSource.value === qSource.value)
				queryVsFrames[qSource.value].push(frames[i]);
		}
	});
	return {
		frames : queryVsFrames,
		compareQueryContext : compareQueryContext
	}
}

ModelFactory.prototype.getCompareModels = function(apiRes, options){
	var resParser = new ResponseParser();
	var uiObject = resParser.parse(apiRes);

	var tableModeler = new SalesTableModel();
	var tableModel = tableModeler.getModel(uiObject, options.container);

	var timeModeler = new SalesTimeModel();
	var timeModel = timeModeler.getCompareTimeModel(uiObject, options.timeline);
	timeModel.reverse();

	var frames = [];
	tableModel.forEach((function(tm){
		frames.push({
			type : tm.tableTitle,
			label : strToFirstUpper(tm.tableTitle, options),
			container : this.getContainer(tm, options),
			timeline : timeModel.pop()
		})
	}).bind(this));
	return frames;
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

ModelFactory.prototype.getDefaultCompareModelTmpl = function(){
	return {
		product : {
			type : null,
			label: null,
			sectors : [],
			timelines : []
		},
		region : {
			type : null,
			label: null,
			sectors : [],
			timelines : []
		}
	}
}


ModelFactory.prototype.getMultiContainerModel = function (frames, compareQueryContext){
	var model = this.getDefaultCompareModelTmpl();
	Object.keys(frames).forEach((function(key){
		var objs = frames[key];
		objs.forEach((function(o){
			if(this.isProductType(o.type)){
				model.product.type = o.type;
				model.product.label = o.label;
				model.product.sectors.push({
					count : o.container.sectors.totalCount,
					label : key.toUpperCase(),
					type : o.type
				});
				this.aggregateTimeGroupsInTimeLine(o.timeline);
				var tLabel = o.timeline.queryDetails.qTarget? 
									key.toUpperCase() + '-' + o.timeline.queryDetails.qTarget.value.toUpperCase() : 
									key.toUpperCase();
				model.product.timelines.push({
					label : tLabel,
					timeline : o.timeline
				})
			}
		}).bind(this));
	}).bind(this));
	model.region = this.getRegionForCompareFrames(frames, compareQueryContext);
	return model;
}

ModelFactory.prototype.getMultiContainerInMultiContainerModel = function (frames, compareQueryContext){
	var model = this.getMultiContainerModel(frames, compareQueryContext);
	var sectors = {};
	model.product.sectors.forEach(function(sector){
		if(!sectors[sector.label])
			sectors[sector.label] = sector;
		else
			sectors[sector.label].count += sector.count;
	});
	model.product.sectors = [];
	for(var key in sectors)
		model.product.sectors.push(sectors[key]);
	
	return model;
}

ModelFactory.prototype.getMultiContainerInContainerModel = function (frames, compareQueryContext){
	return this.getMultiContainerInMultiContainerModel(frames, compareQueryContext);
}

ModelFactory.prototype.getMultiContainerInLeafModel = function (frames, compareQueryContext){
	return this.getMultiContainerInMultiContainerModel(frames, compareQueryContext);
}

ModelFactory.prototype.getMultiContainerInMultiLeafModel = function (frames, compareQueryContext){
	return this.getMultiContainerInMultiContainerModel(frames, compareQueryContext);
}

ModelFactory.prototype.getContainerInMultiContainer = function (frames, compareQueryContext){
	var model = this.getMultiContainerInMultiContainerModel(frames, compareQueryContext);
	model.product.timelines.forEach(function(tl){
		tl.label = tl.timeline.queryDetails.qSource.value.toUpperCase() + '-' + tl.timeline.queryDetails.qTarget.value.toUpperCase();
	});
	return model;
}

ModelFactory.prototype.getContainerInMultiLeafModel = function (frames, compareQueryContext){
	return this.getContainerInMultiContainer(frames, compareQueryContext);
}

ModelFactory.prototype.getLeafInMultiContainerModel = function (frames, compareQueryContext){
	var model = this.getDefaultCompareModelTmpl();
	Object.keys(frames).forEach((function(key){
		var objs = frames[key];
		objs.forEach((function(o){
			model.product.type = o.type;
				model.product.label = o.label;
				model.product.sectors.push({
					count : o.container.sectors.totalCount,
					label : key.toUpperCase(),
					type : o.type
				});
				this.aggregateTimeGroupsInTimeLine(o.timeline);
				var qDetails = o.timeline.queryDetails;
				var tLabel = qDetails.qTarget ? 
							 qDetails.qSource.value.toUpperCase() + '-' + qDetails.qTarget.value.toUpperCase():
							 qDetails.qSource.value.toUpperCase();									
				model.product.timelines.push({
					label : tLabel,
					timeline : o.timeline
				});
		}).bind(this));
	}).bind(this));
	return model;
}

ModelFactory.prototype.getLeafInMultiLeafModel = function (frames, compareQueryContext){
	return this.getLeafInMultiContainerModel(frames, compareQueryContext);
}

ModelFactory.prototype.getMultiLeafModel = function (frames, compareQueryContext){
	return this.getLeafInMultiContainerModel(frames, compareQueryContext);
}

ModelFactory.prototype.getMultiLeafInMultiContainerModel = function (frames, compareQueryContext){
	var model = this.getLeafInMultiContainerModel(frames, compareQueryContext);
	var sectors = {};
	model.product.sectors.forEach(function(sector){
		if(!sectors[sector.label])
			sectors[sector.label] = sector;
		else
			sectors[sector.label].count += sector.count;
	});
	model.product.sectors = [];
	for(var key in sectors)
		model.product.sectors.push(sectors[key]);
	return model;
}

ModelFactory.prototype.getMultiLeafInContainerModel = function (frames, compareQueryContext){
	return this.getMultiLeafInMultiContainerModel(frames, compareQueryContext);
}

ModelFactory.prototype.getMultiLeafInMultiLeafModel = function (frames, compareQueryContext){
}

ModelFactory.prototype.isProductType = function(p){
	var productTypes = ['category', 'categories', 'type', 'types', 'brand', 'brands', 'model', 'models'];
	return _.contains(productTypes, p);
}

ModelFactory.prototype.isRegionType = function(r){
	var regionTypes = ['regions', 'region', 'states', 'state', 'cities', 'city'];
	return _.contains(regionTypes, r);
}

ModelFactory.prototype.aggregateTimeGroupsInTimeLine_old = function(timeline){
	var tgs = timeline.timeGroups;
	tgs.forEach(function(tg){
		Object.keys(tg).forEach(function(key){
			tg[key].totalCount = 0;
			tg[key].forEach(function(v){
				if(v.count)
					tg[key].totalCount += v.count;
			})
		});
	});
}

ModelFactory.prototype.aggregateTimeGroupsInTimeLine = function(timeline){
	var tgs = timeline.timeGroups;
	var newTimeGroup = {};
	tgs.forEach(function(tg){
		Object.keys(tg).forEach(function(key){
			tg[key].forEach(function(v){
				if(!newTimeGroup[key]){
					newTimeGroup[key] = {
						totalCount : v.count
					}
				}
				else{
					newTimeGroup[key].totalCount += v.count;
				}
			})			
		});
	});
	timeline.timeGroups = [newTimeGroup];
}
ModelFactory.prototype.getRegionForCompareFrames = function(frames, compareQueryContext){
	Object.keys(frames).forEach((function(k){
		this.getRegionForCompareFrame(frames[k], compareQueryContext);
	}).bind(this));
}

ModelFactory.prototype.getRegionForCompareFrame = function(frame, compareQueryContext){
	var region = {
		type : null,
		label: null,
		sectors : { 
			top : [],
			others : [],
			totalCount : 0,
			othersCount : 0
		},
		timelines : []
	};
	var sectors = {};
	frame.forEach((function(f){
		if(this.isRegionType(f.type)){
			if(compareQueryContext.qTargets.length > 0){

			}
			else{
				var tmRegions = [];
				f.container.sectors.top.forEach(function(item){
					tmRegions.push(item.key);
					if(!sectors[item.key])
						sectors[item.key] =  { totalCount : item.count };
					else
						sectors[item.key].totalCount += item.count;
				});
				f.container.sectors.others.forEach(function(item){
					if(!sectors[item.key])
						sectors[item.key] =  { totalCount : item.count };
					else
						sectors[item.key].totalCount += item.count;
				});
				region.timelines = this.getTimelinesForRegions(tmRegions, f);
			}
			
		}
	}).bind(this));	
	Object.keys(sectors).forEach(function(sk){
		region.sectors.top.push({
			label : sk,
			count : sectors[sk].totalCount
		});
	});
	return region;
}

ModelFactory.prototype.getTimelinesForRegions = function(tmRegions, frame){
	var regionTimelines = {};
	var tgs = frame.timeline.timeGroups;
	tgs.forEach(function(tg){
		Object.keys(tg).forEach(function(k){
			tg[k].forEach(function(e){
				if(!regionTimelines[e.label])
					regionTimelines[e.label] = {};
				regionTimelines[e.label][k] = {
					count : e.count,
					label : e.label,
					tKey : e.tKey
				};
				
			});
		});
	});
	var qd = frame.timeline.queryDetails;
	var start = qd.qSource.value.toUpperCase() + '-';
	var end = null;
	if(qd.qTarget)
		end = qd.qTarget.value.toUpperCase();

	for(var key in regionTimelines){
		regionTimelines[key].label = end ? start + end : start + key.toUpperCase();
	}

	return regionTimelines;
}






