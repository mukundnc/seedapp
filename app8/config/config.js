var config = {
	logger : {
		logDir : './server/log/',
		logFileName : './server/log/app.log'
	},
	elasticSearch : {
		url : 'http://localhost:9200/',
		salesIndex : 'catsales',
		salesType : 'csales'
	},
	searchContext : {
		line : 1,
		model : 2,
		component : 3,
		line_from_supplier : 4,
		line_from_city : 5,
		line_from_country : 6,
		model_from_supplier : 7,
		model_from_city : 8,
		model_from_country : 9,
		component_from_supplier : 10,
		component_from_city : 11,
		component_from_country : 12,
		supplier : 13,
		city : 14,	
		country : 15,
		line_spend : 16,
		model_spend : 17,
		component_spend : 18,
		line_from_supplier_spend : 19,
		line_from_city_spend : 20,
		line_from_country_spend : 21,
		model_from_supplier_spend : 22,
		model_from_city_spend : 23,
		model_from_country_spend : 24,
		component_from_supplier_spend : 25,
		component_from_city_spend : 26,
		component_from_country_spend : 27,
		supplier_spend : 28,
		city_spend : 29,
		country_spend : 30,
		line_spend_average : 31,
		model_spend_average : 32,
		component_spend_average : 33,
		line_from_supplier_spend_average : 34,
		line_from_city_spend_average : 35,
		line_from_country_spend_average : 36,
		model_from_supplier_spend_average : 37,
		model_from_city_spend_average : 38,
		model_from_country_spend_average : 39,
		component_from_supplier_spend_average : 40,
		component_from_city_spend_average : 41,
		component_from_country_spend_average : 42,
		supplier_average : 43,
		city_average : 44,
		country_average : 45
	},
	saleStrategy : {
		strategyFileName : './web/v1/sales.txt'
	},
	rConfig : {
		forecastFilePath : './server/outliers/Forecast.R'
	}
};


module.exports = config;