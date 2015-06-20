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
		divisor = (dEnd - dStart + ts24Hrs)/(1000 * 60 * 60 * 24 * 30);
	
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

	var dS = d3.min(allValues, function(v) {
				return v;
			 });
	var dE = d3.max(allValues, function(v) {
				return v;
			 });

	var rS = 0;
	var rE = frameHeight;

	var yScale = d3.scale.linear()
						 .domain([dS, dE])
						 .range([rS, rE]);
	var labels = [];
	var arr = [0.25 * dE, 0.5 * dE, 0.75 * dE, dE];
	arr.forEach(function(d){
		labels.push({
			label : Math.round(d),
			xStart : 0,
			yStart : yScale(d),
			xEnd : frameWidth,
			yEnd : yScale(d)
		})
	});
	return {
		yScale : yScale,
		labels : labels
	}
}






