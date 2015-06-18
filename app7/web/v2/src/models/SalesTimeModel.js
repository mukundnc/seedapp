function SalesTimeModel(){

}

SalesTimeModel.prototype.init = function(options){
	this.options = options;

}

SalesTimeModel.prototype.getModel = function(uiTimeObjs, options){
	this.init(options);	
	var times = {
		key1 : {
			timeGroups : []
		},
		key2 : {
			timeGroups : []
		}
	};
	uiTimeObjs.forEach((function(uiTimeObj){
		Object.keys(uiTimeObj).forEach((function(key){
			if(key === 'key1' || key === 'key2'){
				times[key].timeGroups = this.getTimeGroups(uiTimeObj[key].items);
			}
		}).bind(this));
	}).bind(this));
	return times;
}

SalesTimeModel.prototype.getTimeGroups = function(uiTimeItems){
	var tKey = this.getTimeGroupKey(uiTimeItems[0].items);
	var iGroups = this.getItemGroups(uiTimeItems);
	var timeGroups = [];

	for(var i = 0 ; i < iGroups.length ; i++){
		var timeGroup = this.getTimeGroup(iGroups[i]);
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

SalesTimeModel.prototype.getItemGroups = function(uiTimeItems){
	if(uiTimeItems.length < 5) return [uiTimeItems];

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
	console.log(uiTimeItems);
}