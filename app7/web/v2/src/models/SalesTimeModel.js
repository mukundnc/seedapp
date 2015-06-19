function SalesTimeModel(){

}

SalesTimeModel.prototype.init = function(options){
	this.options = options;

}

SalesTimeModel.prototype.getModel = function(uiTimeObjs, options){
	this.init(options);	
	var times = {
		key1 : {
			timeGroups : [],
			type : null
		},
		key2 : {
			timeGroups : [],
			type : null
		}
	};
	uiTimeObjs.forEach((function(uiTimeObj){
		Object.keys(uiTimeObj).forEach((function(key){
			if(key === 'key1' || key === 'key2'){
				times[key].timeGroups = this.getTimeGroups(uiTimeObj[key].items);
				times[key].type = uiTimeObj[key].key;
			}
		}).bind(this));
	}).bind(this));
	return times;
}

SalesTimeModel.prototype.getTimeGroups = function(uiTimeItems){
console.log(uiTimeItems);
	var tKey = this.getTimeGroupKey(uiTimeItems[0].items);
	var iGroups = this.getTimeItemGroups(uiTimeItems);
	var timeGroups = [];

	for(var i = 0 ; i < iGroups.length ; i++){
		var timeGroup = this.getTimeGroup(iGroups[i], tKey);
		timeGroups.push(timeGroup);
	}
	return timeGroups;
}

SalesTimeModel.prototype.getTimeGroupKey = function(uiTimeItems){
	var times = ['yearly', 'monthly', 'daily'];
	for(var i = 0 ; i < uiTimeItems.length; i++){
		if(times.indexOf(uiTimeItems[i].key) !== -1)
			return i;
	}
}

SalesTimeModel.prototype.getTimeItemGroups = function(uiTimeItems){
	if(uiTimeItems.length < 6) return [uiTimeItems];

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

SalesTimeModel.prototype.getTimeGroup = function(uiTimeItems, tKey){
	//console.log(uiTimeItems);
	var itemKeys = Object.keys(uiTimeItems[0].items[tKey].items);
	var lblKey = uiTimeItems[0].items[tKey].key
	var blocks = [];
	var frameW = this.options.width - 300;
	var blockW = frameW/itemKeys.length;
	var barW = padding = blockW/(2*uiTimeItems.length);
	var xStart = 0;
	var yScale = this.getYScaleForTimeGroup(uiTimeItems, tKey);

	itemKeys.forEach((function(itemKey){
		var block = {
			xStart : xStart,
			xEnd : 0,
			bars : []
		};		
		
		uiTimeItems.forEach((function(uiTimeItem){
			
			var itemData = uiTimeItem.items[tKey].items[itemKey];
			
			block.bars.push(this.getBarForTimeItem(xStart, 0, barW, yScale(itemData.doc_count)));

			block.label = this.getBlockLabel(itemData, lblKey);

			xStart += (padding + barW);

		}).bind(this));
		
		block.xEnd = xStart;
		
		blocks.push(block);
	
	}).bind(this));

	return {
		contentLabels : this.getContentLabelsForTimeGroup(uiTimeItems),
		yScale : yScale,
		blocks : blocks
	}
}

SalesTimeModel.prototype.getBarForTimeItem = function(xStart, yStart, w, h){
	return {
		x : xStart,
		y : yStart,
		w : w,
		h : h
	}
}

SalesTimeModel.prototype.getYScaleForTimeGroup = function(uiTimeItems, tKey){
	var allVals = [];
	uiTimeItems.forEach(function(item){
		item.items[tKey].items.forEach(function(dataItem){
			allVals.push(dataItem.doc_count);
		});
	});
	var dS = d3.min(allVals, function(v) {
				return v;
			 });
	var dE = d3.max(allVals, function(v) {
				return v;
			 });

	var rS = 0;
	var rE = this.options.height;

	var yScale = d3.scale.linear()
						 .domain([dS, dE])
						 .range([rS, rE]);
	return yScale;
}

SalesTimeModel.prototype.getContentLabelsForTimeGroup = function(uiTimeItems){
	var labels = [];
	uiTimeItems.forEach(function(item){
		labels.push(item.key);
	});
	return labels;
}

SalesTimeModel.prototype.getBlockLabel = function(uiTimeObj, lblKey){
	var dt = new Date(uiTimeObj.key);

	function getMonth(dt){
		var sY = '-' + dt.getFullYear().toString().substr(2,4);
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

		return map[dt.getMonth()] + sY;
	}
	
	switch(lblKey){
		case 'yearly' : return dt.getFullYear(); break;
		case 'monthly' : return getMonth(dt); break;
		case 'daily' : return dt.getDate(); break;
	}
}










