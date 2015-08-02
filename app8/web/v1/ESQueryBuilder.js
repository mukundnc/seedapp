function ESQueryBuilder(){
	this.client = new $.es.Client({
	  hosts: 'localhost:9200'
	});
}

ESQueryBuilder.prototype.getBasicQuery = function(){
	return {
		index: 'catsales',
		type: 'csales',
		body: {
			query: {
				match: {
					line: 'Desktop PC'
				}
			},
			//fields : ['city'],
			size:25
		}
	}
}

ESQueryBuilder.prototype.getBasicFilteredQuery = function(){
	return {
		index: 'catsales',
		type: 'csales',
		body: {
			query: {
				filtered: {
					query :{
						match: {
							line: 'Desktop PC'
						}
					},
					filter : {
						term : {'country' : 'Germany'}
					}

				}		
			},
			size:25,
			_source : true
		}
	}
}

ESQueryBuilder.prototype.getAndFilteredQuery = function(){
	return {
		index: 'catsales',
		type: 'csales',
		body: {
			query: {
				filtered: {
					query :{
						match: {
							category: 'Automobile'
						}
					},
					filter : {
						and : [
							{term : {'brand' : 'BMW'}},
							{term : {'region': 'South'}},
							{term : {'city' : 'Guntur'}}
						]
						
					}

				}		
			},
			size:25,
			_source : true
		}
	}
}

ESQueryBuilder.prototype.getOrFilteredQuery = function(){
	return {
		index: 'catsales',
		type: 'csales',
		body: {
			query: {
				filtered: {
					query :{
						match_all: {
						}
					},
					filter : {
						or : [
							{term : {'type' : 'Car'}},
							{term : {'type': 'Bike'}}
						],
						and : [
							{term : {'state' : 'UP'}}
						]
					}

				}		
			},
			size:100,
			_source : true
		}
	}
}

ESQueryBuilder.prototype.getBoolFilteredQuery = function(){
	return {
		index: 'catsales',
		type: 'csales',
		body: {
			query: {
				filtered: {
					query :{
						bool : {
							should : {
								terms : {
									type : ['Bike', 'Car']
								}
							}
						}
					}

				}		
			},
			size:25,
			_source : true
		}
	}
}

ESQueryBuilder.prototype.getMatchAllWithMultiAndQuery = function(){
	
}
ESQueryBuilder.prototype.executeQuery = function(url, cbOnDone){
	// $.getJSON(url, cbOnDone);
	// return;

	var esQuery = this.getBasicFilteredQuery();
	this.client.search(esQuery).then(this.onQueryResponse.bind(this, cbOnDone), this.onQueryError.bind(this));	
}

ESQueryBuilder.prototype.onQueryResponse = function(cbOnDone, data){
	cbOnDone({
		success : true,
		results : [data]
	})
}
ESQueryBuilder.prototype.onQueryError = function(err){
	console.trace(err.message);
}
