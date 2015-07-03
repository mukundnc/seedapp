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


ModelFactory.prototype.getCompareFrameModel = function(apiRes, options){
	var fms = this.getFrameModel(apiRes, options);
	var model = this.getDefaultCompareModelTmpl();
	fms.forEach((function(fm){		
		if(this.isProductType(fm.container.type)){
			var tLabels = [];
			model.product.type = fm.type;
			model.product.label = fm.label;
			fm.container.sectors.top.forEach(function(s){
				model.product.sectors.push({
					count : s.count,
					label : s.key,
					type : fm.container.type
				});
				tLabels.push(s.key);
			});
			model.product.timelines = this.getTimeLinesForCompare(fm.timeline, tLabels);
		}
		else if(this.isRegionType(fm.container.type)){
			var tLabels = [];
			model.region.type = fm.type;
			model.region.label = fm.label;
			fm.container.sectors.top.forEach(function(s){
				model.region.sectors.push({
					count : s.count,
					label : s.key,
					type : fm.container.type
				});
				tLabels.push(s.key);
			});
			model.region.timelines = this.getTimeLinesForCompare(fm.timeline, tLabels);
		}
	}).bind(this));	
	console.log(fms);	
	return model;
}

ModelFactory.prototype.isProductType = function(p){
	var productTypes = ['category', 'categories', 'type', 'types', 'brand', 'brands', 'model', 'models'];
	return _.contains(productTypes, p);
}

ModelFactory.prototype.isRegionType = function(r){
	var regionTypes = ['regions', 'region', 'states', 'state', 'cities', 'city'];
	return _.contains(regionTypes, r);
}

ModelFactory.prototype.getTimeLinesForCompare = function(timeline, tLabels){
	var tlArr = [];
	tLabels.forEach(function(tl){
		tlArr.push(JSON.parse(JSON.stringify(timeline)));
	});
	var copyTLables = tLabels.slice(0);
	copyTLables.reverse();
	
	tlArr.forEach(function(tl){
		var tgs = tl.timeGroups;
		var timeLabel = copyTLables.pop();
		tgs.forEach(function(tg){
			Object.keys(tg).forEach(function(k){
				var arrTime = tg[k];
				var toKeep = _.where(arrTime, {label : timeLabel})[0];
				tg[k] = toKeep;
			});
		});
	});
	copyTLables = tLabels.slice(0);
	copyTLables.reverse();
	var timelines = [];
	tlArr.forEach(function(tl){
		timelines.push({
			label : copyTLables.pop(),
			timeline : {
				axes : tl.axes,
				timeGroups : tl.timeGroups
			}			
		});
	});
	return timelines;
}
