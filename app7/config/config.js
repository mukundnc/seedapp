var config = {
	logger : {
		logDir : './server/log/',
		logFileName : './server/log/app.log'
	},
	elasticSearch : {
		url : 'localhost:9200',
		salesIndex : 'companysales',
		salesType : 'sales'
	}
};


module.exports = config;