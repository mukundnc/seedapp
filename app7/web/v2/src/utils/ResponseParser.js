function ResponseParser (){

}

ResponseParser.prototype.parse = function(apiRes){
	var uiObject = {};
	var agg = apiRes.results[0].aggregations;
	function addHierarchy (obj, apiObj, strRootKey){
		obj.key = strRootKey;
		obj.items = [];
		if(apiObj.buckets){
			apiObj.buckets.forEach(function(bucket){
				var bKeys = Object.keys(bucket);
				var item = { key : '', items : [] };	
				bKeys.forEach(function(bKey){													
					if(typeof(bucket[bKey]) === 'object'){
						var t = {key : ''};
						item.items.push(t);
						addHierarchy(t, bucket[bKey], bKey);
					}
					else
						item[bKey] = bucket[bKey];				
				});	
				obj.items.push(item);			
			});
		}
	}

	var i = 1;
	Object.keys(agg).forEach(function(a){
		var k = 'key' + i;
		uiObject[k] = {};
		addHierarchy(uiObject[k], agg[a], a);
		i++;
	});
	console.log(uiObject);
	return uiObject;
}

