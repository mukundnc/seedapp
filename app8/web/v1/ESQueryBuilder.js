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
					line: 'Microwave'
				}
			},
			//fields : ['city'],
			size:25,
			aggs : {
				models : {
					terms : { 
						field : 'model',
						size : 50 
					}
				}
			}
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
							line: 'Microwave'
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
							line: 'Microwave'
						}
					},
					filter : {
						and : [
							{term : {name : 'Ajax'}}
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
						and : [
							{term : {'line' : 'Microwave'}}
						]
					}
				}		
			},
			size:100,
			_source : true,
			aggs : {
				models : {
					terms : { 
						field : 'model',
						size : 50 
					},
					aggs : {}
				},
				countries : {
					terms : {
						field : 'country',
						size : 50
					},
					aggs : {
						cities : {
							terms : {
								field : 'city',
								size : 50
							},
							aggs:{}
						}
					}
				}
			}
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
	$.getJSON(url, cbOnDone);
	return;

	// var esQuery = this.getOrFilteredQuery();
	// this.client.search(esQuery).then(this.onQueryResponse.bind(this, cbOnDone), this.onQueryError.bind(this));	
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
