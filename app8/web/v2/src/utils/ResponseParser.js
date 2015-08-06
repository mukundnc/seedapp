function ResponseParser (){

}

ResponseParser.prototype.parse = function(apiRes){
	var uiObjects = [];
	if(apiRes.results.aggregations){
		var uiObject = this.getUIObjectForAggregation(apiRes.results.aggregations);
		uiObject.queryDetails = { qSource : apiRes.query.product, qTarget : apiRes.query.supplier};
		uiObjects.push(uiObject);
	}
	return uiObjects;
}

ResponseParser.prototype.getUIObjectForAggregation = function(agg){
	var uiObject = {};
	var i = 1;
	Object.keys(agg).forEach((function(a){
		if(a !== 'amount'){
			var k = 'key' + i;
			uiObject[k] = {};
			this.addNodesRecurssive(uiObject[k], agg[a], a);
			i++;
		}		
	}).bind(this));
	return uiObject;	
}

ResponseParser.prototype.addNodesRecurssive = function(obj, apiObj, strRootKey){
	var self = this;
	obj.key = strRootKey;
	obj.items = [];
	if(apiObj.buckets){
		apiObj.buckets.forEach(function(bucket){
			var bKeys = Object.keys(bucket);
			var item = { key : '', items : [] };	
			bKeys.forEach(function(bKey){													
				if(typeof(bucket[bKey]) === 'object' && bKey !== 'amount'){
					var t = {key : ''};
					item.items.push(t);
					self.addNodesRecurssive(t, bucket[bKey], bKey);
				}
				else if(bKey === 'amount')
					item[bKey] = bucket[bKey].value;
				else
					item[bKey] = bucket[bKey];				
			});	
			obj.items.push(item);			
		});
	}
}