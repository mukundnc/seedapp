function SalesTimeModel(){

}

SalesTimeModel.prototype.init = function(options){
	this.options = options;

}

SalesTimeModel.prototype.getModel = function(uiTimeObjs, options){
	this.init(options);	
	var timeModels = [];
	for(var i = 0 ; i < uiTimeObjs.length; i++){
		var timeModel = this.getModeltemplate();
		this.initAxes(timeModel, uiTimeObjs[i]);
		this.initTimeGroups(timeModel, uiTimeObjs[i]);
		timeModels.push(timeModel);
	}
	return timeModels;
}

SalesTimeModel.prototype.getModeltemplate = function(){
	return {
		key1 : {
			timeGroups : [],
			type : null
		},
		key2 : {
			timeGroups : [],
			type : null
		},
		axes : {
			x : {},
			y : {}
		}
	}
}

SalesTimeModel.prototype.initAxes = function(timeModel, uiTimeObj){
	var frameWidth = this.options.width - 300;
	var frameHeight = this.options.height;

	timeModel.axes.x = {
		xStart : 0,
		yStart : 0,
		xEnd : frameWidth,
		yEnd : 0,
		labels : this.getXAxisLabels(timeModel, frameWidth)
	};
	timeModel.axes.y = {
		xStart : 0,
		yStart : 0,
		xEnd : 0,
		yEnd : frameHeight,
		key1 : this.getYAxisLabelsForModelKey('key1', uiTimeObj, frameHeight, frameWidth),
		key2 : this.getYAxisLabelsForModelKey('key2', uiTimeObj, frameHeight, frameWidth),
	};
}

SalesTimeModel.prototype.getXAxisLabels = function(timeModel, frameWidth){
	var ts24Hrs = 24 * 60 * 60 * 1000;
	var dStart = new Date(this.options.startDate);
	var dEnd = new Date(this.options.endDate);

	var divisor = dEnd.getFullYear() - dStart.getFullYear() + 1;
	if(this.options.dateDist === 'daily')
		divisor = (dEnd - dStart + ts24Hrs)/(1000 * 60 * 60 * 24) ;
	else if(this.options.dateDist === 'monthly')
		divisor = dEnd.getMonth() - dStart.getMonth() + 1;
	
	var labelW = frameWidth/divisor;
	var labels = [];
	switch(this.options.dateDist){
		case 'yearly' : labels = this.getYearlyXAxisLabels(dStart, dEnd, labelW); break;
		case 'monthly' : labels = this.getMonthlyXAxisLabels(dStart, dEnd, labelW); break;
		case 'daily' : labels = this.getDailyXAxisLabels(this.options.startDate, this.options.endDate, labelW);
	}
	return labels;

}

SalesTimeModel.prototype.getYearlyXAxisLabels = function(startDate, endDate, lblWidth){
	var labels = [];
	var xStart = 0;
	for(var i = startDate.getFullYear(); i <= endDate.getFullYear(); i++){
		labels.push({
			xStart : xStart,
			xEnd : xStart + lblWidth,
			label : i.toString()
		});
		xStart += lblWidth;
	}
	return labels;
}

SalesTimeModel.prototype.getMonthlyXAxisLabels = function(startDate, endDate, lblWidth){
	var map = {
			0 : 'Jan',
			1 : 'Feb',
			2 : 'Mar',
			3 : 'Apr',
			4 : 'May',
			5 : 'Jun',
			6 : 'Jul',
			7 : 'Aug',
			8 : 'Sep',
			9 : 'Oct',
			10 : 'Nov',
			11 : 'Dec'
		};
	var sMonth = startDate.getMonth();
	var sYear = startDate.getFullYear().toString().substr(2,4);
	var eMonth = endDate.getMonth();
	var xStart = 0;
	var labels = [];
	while(sMonth <= eMonth){
		labels.push({
			xStart : xStart,
			xEnd : xStart + lblWidth,
			label : map[sMonth] + '-' + sYear
		});
		sMonth++;
		xStart += lblWidth;
	}
	return labels;
}

SalesTimeModel.prototype.getDailyXAxisLabels = function(startDate, endDate, lblWidth){
	var tsStart = Date.parse(startDate);
	var tsEnd = Date.parse(endDate);
	var ts24Hrs = 24 * 60 * 60 * 1000;
	var labels = [];
	var xStart = 0;
	while(tsStart <= tsEnd){
		labels.push({
			xStart : xStart,
			xEnd : xStart + lblWidth,
			label : new Date(tsStart).getDate()
		});
		tsStart += ts24Hrs;
		xStart += lblWidth;
	}
	return labels;
}

SalesTimeModel.prototype.getTimeGroupKey = function(uiTimeItems){
	var times = ['yearly', 'monthly', 'daily'];
	for(var i = 0 ; i < uiTimeItems.length; i++){
		if(times.indexOf(uiTimeItems[i].key) !== -1)
			return i;
	}
}

SalesTimeModel.prototype.getYAxisLabelsForModelKey = function(modelKey, uiTimeObj, frameHeight, frameWidth){
	if(!uiTimeObj[modelKey]) return null;

	var tKey =  this.getTimeGroupKey(uiTimeObj[modelKey].items[0].items);
	var allValues = [];
	uiTimeObj[modelKey].items.forEach(function(uiTimeItems){
		uiTimeItems.items[tKey].items.forEach(function(dataItem){
			allValues.push(dataItem.doc_count);
		});
	});

	var dS = 0;
	var dE = d3.max(allValues, function(v) {
				return v;
			 });

	var rS = 0;
	var rE = frameHeight;

	var yScale = d3.scale.linear()
						 .domain([dS, dE])
						 .range([rS, rE]);
	var labels = [];
	var dR = dE - dS;
	if(dR > 1){
		var arr = [];
		var div = 1;
		if(dR > 3)
			div = 4
		else if(dR > 2)
			div = 3;
		else
			div = 2;
		for(var i = dS+dR/div ; i <= dE ; i+=dR/div){
			arr.push(i)
		}
		arr.forEach(function(d){
			labels.push({
				label : Math.round(d),
				xStart : 0,
				yStart : yScale(d),
				xEnd : frameWidth,
				yEnd : yScale(d)
			})
		});
	}
	else{
		yScale = function(d) { return frameHeight };
		labels.push({
			label : Math.round(dE),
			xStart : 0,
			yStart : yScale(dE),
			xEnd : frameWidth,
			yEnd : yScale(dE)
		})

	}
	return {
		yScale : yScale,
		labels : labels
	}
}

SalesTimeModel.prototype.initTimeGroups = function(timeModel, uiTimeObj){
	for(var key in uiTimeObj){
		if(key === 'key1' || key === 'key2'){
			this.getTimeGroups(uiTimeObj[key].items, key, timeModel);
			timeModel[key].type = uiTimeObj[key].key;
		}
	}

	if(timeModel.key2.type){
		var regionTypes = ['regions', 'states', 'cities'];
		if(regionTypes.indexOf(timeModel.key1.type) !== -1){
			var key1Copy = JSON.parse(JSON.stringify(timeModel.key1));
			timeModel.key1 = timeModel.key2;
			timeModel.key2 = key1Copy;
		}
	}
}

SalesTimeModel.prototype.getTimeGroups = function(uiTimeItems, modelKey, timeModel){
	var timeItemGroups = this.getTimeItemGroups(uiTimeItems);
	for (var i = 0 ; i < timeItemGroups.length ; i++){
		timeModel[modelKey].timeGroups.push(this.getTimeGroupForTimeGroupItem(timeItemGroups[i], modelKey, timeModel));
	}
}

SalesTimeModel.prototype.getTimeItemGroups = function(uiTimeItems){
	if(uiTimeItems.length < 6) return [uiTimeItems];
	uiTimeItems.reverse();
	
	var bContinue = true;
	var groups = [];
	while(bContinue){
		var group = [];
		for(i = 0 ; i < 5 ; i++){
			var t = uiTimeItems.pop();
			if(t)
				group.push(t);
			else{
				bContinue = false;
				break;
			}
		}
		if(group.length > 0)
			groups.push(group);
	}
	return groups;
}

SalesTimeModel.prototype.getTimeGroupForTimeGroupItem = function(uiTimeItems, modelKey, timeModel){
	var timeGroup = {};
	var yScale = timeModel.axes.y[modelKey].yScale;
	timeModel.axes.x.labels.forEach((function(label){
		timeGroup[label.label] = this.getTimeContentsInLabel(uiTimeItems, label, yScale);
	}).bind(this));
	return timeGroup;
}

SalesTimeModel.prototype.getTimeContentsInLabel = function(uiTimeItems, label, yScale){
	var timeContents = [];
	var xStart = label.xStart;
	var yStart = 0;
	var blockW = label.xEnd - label.xStart;
	var barW = padding = blockW / (2 * uiTimeItems.length);

	var tKey = this.getTimeGroupKey(uiTimeItems[0].items);
	uiTimeItems.forEach((function(uiTimeItem){
		var timeItems = uiTimeItem.items[tKey].items;
		timeContents.push({
			label : uiTimeItem.key,
			x : xStart,
			y : yStart,
			w : barW,
			h : this.getMeasuredValue(timeItems, label.label, yScale)
		});
		xStart += (barW + padding);

	}).bind(this));
	return timeContents;
}

SalesTimeModel.prototype.getMeasuredValue = function(timeItems, label, yScale){	
	for(var i = 0 ; i < timeItems.length ; i++){
		var item = timeItems[i];
		var itemDate = new Date(item.key)
		if(this.options.dateDist === 'yearly'){
			if(itemDate.getFullYear().toString() === label)
				return yScale(item.doc_count); 
		}
		else if(this.options.dateDist === 'monthly'){
			if(itemDate.getMonth() === this.getMonthFromLabel(label))
				return yScale(item.doc_count); 
		}
		else if(this.options.dateDist === 'daily'){
			if(itemDate.getDate() === parseInt(label))
				return yScale(item.doc_count); 
		}
	}
	return 0;
}

SalesTimeModel.prototype.getMonthFromLabel = function(monthLabel){
	var sMonth = monthLabel.split('-')[0];
	var map = {
		Jan : 0,
		Feb : 1,
		Mar : 2,
		Apr : 3,
		May : 4,
		Jun : 5,
		Jul : 6,
		Aug : 7,
		Sep : 8,
		Oct : 9,
		Nov : 10,
		Dec : 11
	};
	return map[sMonth];
}



