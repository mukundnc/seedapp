function ResponseParser (){

}

ResponseParser.prototype.parse = function(apiRes){
	var uiObjects = [];
	var results = [apiRes.results];
	results.forEach((function(result){
		if(result.aggregations){
			var uiObject = this.getUIObjectForAggregation(result.aggregations);
			uiObject.queryDetails = { qSource : result.qSource, qTarget : result.qTarget};
			uiObjects.push(uiObject);
		}
	}).bind(this));
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
					item[bKey] = bucket[bKey].value || bucket[bKey];
				else
					item[bKey] = bucket[bKey];				
			});	
			obj.items.push(item);			
		});
	}
}

module.exports = ResponseParser;