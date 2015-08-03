var sc = require('./../../config/config').searchContext;

function QueryAggregator(){

}


QueryAggregator.prototype.getAggregates = function(query){
	this.context = query.context;
	var agg = {};
	
	switch(this.context){
		case sc.line : agg = this.getLineAgg(); break;
		case sc.model : agg = this.getModelAgg(); break;
		case sc.component : agg = this.getComponentAgg(); break;
		case sc.line_from_supplier : agg = this.getLineFromSupplierAgg(); break;
		case sc.model_from_supplier : agg = this.getModelFromSupplierAgg(); break;
		case sc.component_from_supplier : agg = this.getComponentFromSupplierAgg(); break;
		case sc.line_from_city : agg = this.getLineFromCityAgg(); break;
		case sc.model_from_city : agg = this.getModelFromCityAgg(); break;
		case sc.component_from_city : agg = this.getComponentFromCityAgg(); break;
		case sc.line_from_country : agg = this.getLineFromCountryAgg(); break;
		case sc.model_from_country : agg = this.getModelFromCountryAgg(); break;
		case sc.component_from_country : agg = this.getComponentFromCountryAgg(); break;
		case sc.supplier : agg = this.getSupplierAgg(); break;
		case sc.city : agg = this.getCityAgg(); break;
		case sc.country : agg = this.getCountryAgg(); break;
	}

	return agg;
}

QueryAggregator.prototype.getLineAgg = function(){
	return {
		aggs : {
			models : this.getModelAggTmpl(),
			countries : this.getCountryAggTmpl()
		}
	};
}

QueryAggregator.prototype.getModelAgg = function(){
	return {
		aggs : {
			countries : this.getCountryAggTmpl()
		}
	};
}

QueryAggregator.prototype.getComponentAgg = function(){
	return {
		aggs : {
			countries : this.getCountryAggTmpl()
		}
	};
}

QueryAggregator.prototype.getLineFromSupplierAgg = function(){
	return {
		aggs : {
			models : this.getModelAggTmpl()
		}
	};	
}

QueryAggregator.prototype.getModelFromSupplierAgg = function(){
	return {};
}

QueryAggregator.prototype.getComponentFromSupplierAgg = function(){
	return {};
}

QueryAggregator.prototype.getLineFromCityAgg = function(){
	return {
		aggs : {
			models : this.getModelAggTmpl(),
			suppliers : this.getSupplierAggTmpl()
		}
	};
}

QueryAggregator.prototype.getModelFromCityAgg = function(){
	return {
		aggs : {
			suppliers : this.getSupplierAggTmpl()
		}
	};	
}

QueryAggregator.prototype.getComponentFromCityAgg = function(){
	return {
		aggs : {
			suppliers : this.getSupplierAggTmpl()
		}
	};
}

QueryAggregator.prototype.getLineFromCountryAgg = function(){
	return {
		aggs : {
			models : this.getModelAggTmpl(),
			cities : this.getCityAggTmpl()
		}
	};
}

QueryAggregator.prototype.getModelFromCountryAgg = function(){
	return {
		aggs : {
			cities : this.getCityAggTmpl()
		}
	};
}

QueryAggregator.prototype.getComponentFromCountryAgg = function(){
	return {
		aggs : {
			cities : this.getCityAggTmpl()
		}
	};
}

QueryAggregator.prototype.getSupplierAgg = function(){
	return {
		aggs : {
			lines : this.getLineAggTmpl()
		}
	};
}

QueryAggregator.prototype.getCityAgg = function(){
	return {
		aggs : {
			lines : this.getLineAggTmpl(),
			suppliers : this.getSupplierAggTmpl()
		}
	};
}

QueryAggregator.prototype.getCountryAgg = function(){
	return {
		aggs : {
			lines : this.getLineAggTmpl(),
			cities : this.getCityAggTmpl()
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
			models : this.getModelAggTmpl()
		}
	};
}

QueryAggregator.prototype.getModelAggTmpl= function(){
	return {
		terms : {
			field : 'model',
			size : 50
		},
		aggs : {}
	};
}

QueryAggregator.prototype.getCountryAggTmpl = function(){
	return {
		terms : {
			field : 'country',
			size : 50
		},
		aggs : {
			cities : this.getCityAggTmpl()
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
			suppliers : this.getSupplierAggTmpl()
		}
	};
}

QueryAggregator.prototype.getSupplierAggTmpl = function(){
	return {
		terms : {
			field : 'name',
			size : 50
		},
		aggs : {}
	};
}

module.exports = QueryAggregator;