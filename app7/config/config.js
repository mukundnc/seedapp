var config = {
	logger : {
		logDir : './server/log/',
		logFileName : './server/log/app.log'
	},
	elasticSearch : {
		url : 'localhost:9200',
		salesIndex : 'companysales',
		salesType : 'sales'
	},
	searchContext : {
		category : 1,
		category_in_region : 2,
		category_in_state : 3,
		category_in_city : 4,
		type : 5,
		type_in_region : 6,
		type_in_state : 7,
		type_in_city : 8,
		brand : 9,
		brand_in_region : 10,
		brand_in_state : 11,
		brand_in_city : 12,
		model : 13,
		model_in_region : 14,
		model_in_state : 15,
		model_in_city : 16,
		region : 17,
		state : 18,
		city : 19
	},
	saleStrategy : {
		strategyFileName : './web/v1/sales.txt'
	}
};


module.exports = config;