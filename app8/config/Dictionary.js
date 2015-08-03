var DomainStringMap = {
	us : 'US',
	usa : 'US',
	uk : 'UK'
}

function getDomainQualifiedStr(str){
	var dqs = DomainStringMap[str];
	if(!dqs){
		dqs = '';
		var arr = str.split(' ');
		for(var i = 0 ; i < arr.length; i++){
			if(arr[i].length > 0){
				if(i === 0)
					dqs += arr[i].replace(arr[i][0], arr[i][0].toUpperCase());
				else
					dqs += (' ' + arr[i].replace(arr[i][0], arr[i][0].toUpperCase()));
			}
		}
	}
	return dqs;
}

module.exports = {
	getDomainQualifiedStr : getDomainQualifiedStr
}

































