var sc = require('./../../config/config').searchContext;

function QueryAggregator(){

}


QueryAggregator.prototype.getAggregates = function(query){
	this.query = query;
	var agg = {};
	
	switch(query.context){
		case sc.line : 
		case sc.line_spend : 
			agg = this.getLineAgg(); 
			break;
		case sc.model : 
		case sc.model_spend : 
			agg = this.getModelAgg(); 
			break;
		case sc.component : 
		case sc.component_spend : 
			agg = this.getComponentAgg(); 
			break;
		case sc.line_from_supplier : 
		case sc.line_from_supplier_spend : 
			agg = this.getLineFromSupplierAgg(); 
			break;
		case sc.model_from_supplier : 
		case sc.model_from_supplier_spend : 
			agg = this.getModelFromSupplierAgg(); 
			break;
		case sc.component_from_supplier : 
		case sc.component_from_supplier_spend : 
			agg = this.getComponentFromSupplierAgg(); 
			break;
		case sc.line_from_city : 
		case sc.line_from_city_spend : 
			agg = this.getLineFromCityAgg(); 
			break;
		case sc.model_from_city : 
		case sc.model_from_city_spend : 
			agg = this.getModelFromCityAgg(); 
			break;
		case sc.component_from_city : 
		case sc.component_from_city_spend : 
			agg = this.getComponentFromCityAgg(); 
			break;
		case sc.line_from_country : 
		case sc.line_from_country_spend : 
			agg = this.getLineFromCountryAgg(); 
			break;
		case sc.model_from_country : 
		case sc.model_from_country_spend : 
			agg = this.getModelFromCountryAgg(); 
			break;
		case sc.component_from_country : 
		case sc.component_from_country_spend : 
			agg = this.getComponentFromCountryAgg(); 
			break;
		case sc.supplier : 
		case sc.supplier_spend : 
			agg = this.getSupplierAgg(); 
			break;
		case sc.city : 
		case sc.city_spend : 
			agg = this.getCityAgg(); 
			break;
		case sc.country : 
		case sc.country_spend : 
			agg = this.getCountryAgg(); 
			break;
	}
	this.addTimeAggregate(agg);
	return agg;
}

QueryAggregator.prototype.getLineAgg = function(){
	return {
		aggs : {
			models : this.getModelAggTmpl(),
			countries : this.getCountryAggTmpl(),
			amount : { "sum" : { "field" : "rate" } }
		}
	};
}

QueryAggregator.prototype.getModelAgg = function(){
	return {
		aggs : {
			countries : this.getCountryAggTmpl(),
			components : this.getComponentAggTmpl(),
			amount : { "sum" : { "field" : "rate" } }
		}
	};
}

QueryAggregator.prototype.getComponentAgg = function(){
	return {
		aggs : {
			countries : this.getCountryAggTmpl(),
			amount : { "sum" : { "field" : "rate" } }
		}
	};
}

QueryAggregator.prototype.getLineFromSupplierAgg = function(){
	return {
		aggs : {
			models : this.getModelAggTmpl(),
			amount : { "sum" : { "field" : "rate" } }
		}
	};	
}

QueryAggregator.prototype.getModelFromSupplierAgg = function(){
	return {
		aggs : {
			components : this.getComponentAggTmpl(),
			amount : { "sum" : { "field" : "rate" } }
		}
	};
}

QueryAggregator.prototype.getComponentFromSupplierAgg = function(){
	return {
		aggs : {
			amount : { "sum" : { "field" : "rate" } }
		}
	};
}

QueryAggregator.prototype.getLineFromCityAgg = function(){
	return {
		aggs : {
			models : this.getModelAggTmpl(),
			suppliers : this.getSupplierAggTmpl(),
			amount : { "sum" : { "field" : "rate" } }
		}
	};
}

QueryAggregator.prototype.getModelFromCityAgg = function(){
	return {
		aggs : {
			components : this.getComponentAggTmpl(),
			suppliers : this.getSupplierAggTmpl(),
			amount : { "sum" : { "field" : "rate" } }
		}
	};	
}

QueryAggregator.prototype.getComponentFromCityAgg = function(){
	return {
		aggs : {
			suppliers : this.getSupplierAggTmpl(),
			amount : { "sum" : { "field" : "rate" } }
		}
	};
}

QueryAggregator.prototype.getLineFromCountryAgg = function(){
	return {
		aggs : {
			models : this.getModelAggTmpl(),
			cities : this.getCityAggTmpl(),
			amount : { "sum" : { "field" : "rate" } }
		}
	};
}

QueryAggregator.prototype.getModelFromCountryAgg = function(){
	return {
		aggs : {
			components : this.getComponentAggTmpl(),
			cities : this.getCityAggTmpl(),
			amount : { "sum" : { "field" : "rate" } }
		}
	};
}

QueryAggregator.prototype.getComponentFromCountryAgg = function(){
	return {
		aggs : {
			cities : this.getCityAggTmpl(),
			amount : { "sum" : { "field" : "rate" } }
		}
	};
}

QueryAggregator.prototype.getSupplierAgg = function(){
	return {
		aggs : {
			lines : this.getLineAggTmpl(),
			amount : { "sum" : { "field" : "rate" } }
		}
	};
}

QueryAggregator.prototype.getCityAgg = function(){
	return {
		aggs : {
			lines : this.getLineAggTmpl(),
			suppliers : this.getSupplierAggTmpl(),
			amount : { "sum" : { "field" : "rate" } }
		}
	};
}

QueryAggregator.prototype.getCountryAgg = function(){
	return {
		aggs : {
			lines : this.getLineAggTmpl(),
			cities : this.getCityAggTmpl(),
			amount : { "sum" : { "field" : "rate" } }
		}
	};
}

QueryAggregator.prototype.getLineAggTmpl = function(){
	return {
		terms : {
			field : 'line',
			size : 50
		},
		aggs : {
			models : this.getModelAggTmpl(),
			amount : { "sum" : { "field" : "rate" } }
		}
	};
}

QueryAggregator.prototype.getModelAggTmpl= function(){
	return {
		terms : {
			field : 'model',
			size : 50
		},
		aggs : {
			amount : { "sum" : { "field" : "rate" } }
		}
	};
}

QueryAggregator.prototype.getComponentAggTmpl= function(){
	return {
		terms : {
			field : 'component',
			size : 50
		},
		aggs : {
			amount : { "sum" : { "field" : "rate" } }
		}
	};
}

QueryAggregator.prototype.getCountryAggTmpl = function(){
	return {
		terms : {
			field : 'country',
			size : 50
		},
		aggs : {
			cities : this.getCityAggTmpl(),
			amount : { "sum" : { "field" : "rate" } }
		}
	};
}

QueryAggregator.prototype.getCityAggTmpl = function(){
	return {
		terms : {
			field : 'city',
			size : 50
		},
		aggs : {
			suppliers : this.getSupplierAggTmpl(),
			amount : { "sum" : { "field" : "rate" } }
		}
	};
}

QueryAggregator.prototype.getSupplierAggTmpl = function(){
	return {
		terms : {
			field : 'name',
			size : 50
		},
		aggs : {
			amount : { "sum" : { "field" : "rate" } }
		}
	};
}

QueryAggregator.prototype.addTimeAggregate = function(agg){
	if(!agg.aggs) return;
	if(Object.keys(agg.aggs).length === 0) return;
	var root = agg.aggs;

	Object.keys(root).forEach((function(k){
		var t = this.getTimeAggregate();
		var tKey = Object.keys(t)[0];
		if(root[k].aggs)
			root[k].aggs[tKey] = t[tKey];
	}).bind(this));

}

QueryAggregator.prototype.getTimeAggregate = function(){
	var time = this.query.time;
	if(!time.isPresent)
		return this.getYearlyTimeAgg();
	
	if(time.values[0].filter.dist === 'daily')
		return this.getDailyTimeAgg();

	if(time.values[0].filter.dist === 'monthly')
		return this.getMonthlyTimeAgg();

	return this.getYearlyTimeAgg();
}


QueryAggregator.prototype.getYearlyTimeAgg = function(){
	return {
		yearly : {
			date_histogram : {
				field : 'date',
				interval : 'year',
				format : 'YYYY/MM/DD'
			}
		}
	}	
}

QueryAggregator.prototype.getMonthlyTimeAgg = function(){
	return {
		monthly : {
			date_histogram : {
				field : 'date',
				interval : 'month',
				format : 'YYYY/MM/DD'
			}
		}
	}	

}

QueryAggregator.prototype.getDailyTimeAgg = function(){
	return {
		daily : {
			date_histogram : {
				field : 'date',
				interval : 'day',
				format : 'YYYY/MM/DD'
			}
		}
	}	

}

module.exports = QueryAggregator;