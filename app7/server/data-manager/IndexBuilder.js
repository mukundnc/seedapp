var logger = require('./../utils/Logger');
var space = '  ';

function IndexBuilder(){

}

IndexBuilder.prototype.build = function(req, res, saleStrategy){
	this.saleStrategy = saleStrategy;
	var self = this;
	var sYKeys = Object.keys(saleStrategy.sales.region_category);
	var sQKeys = ['q1', 'q2', 'q3', 'q4'];
	var sRKeys = ['east', 'west', 'north', 'south'];
	var sCKeys = ['automobiles', 'electronics', 'appliances', 'cloths'];

	sYKeys = [sYKeys[0]];
	sQKeys = [sQKeys[0]];
	sRKeys = [sRKeys[0]];
	sCKeys = [sCKeys[0]];
	var sales = [];

	sYKeys.forEach(function(sYkey){
		sQKeys.forEach(function(sQKey){
			sRKeys.forEach(function(sRKey){
				sCKeys.forEach(function(sCKey){
					var products = self.getSalesProductsForYearQuarterRegionCategory(sYkey, sQKey, sRKey, sCKey);
					sales = sales.concat(products);
				});
			});
		});
	});

	res.json({success: true, message: 'indices built successfully'});
}

IndexBuilder.prototype.getSalesProductsForYearQuarterRegionCategory = function(year, q, region, category){
	var dist = this.getBrandDistribution(year, q, category);
	if(!dist){
		logger.log('No distribution found for - ' + year + space + q + space + region + space + category);
		return [];
	}
	var salesDistDetails = this.getSalesDistributionDetails(year, q, region, category, dist);
	logger.log(salesDistDetails);
}

IndexBuilder.prototype.getBrandDistribution = function(year, q, category){
	var cYKey = year.replace('s', 'c');
	return this.saleStrategy.sales.category_brands[cYKey][q][category];
}

IndexBuilder.prototype.getSalesDistributionDetails = function(year, q, region, category, dist){
	var sDist = {
		count : this.saleStrategy.sales.region_category[year][q][region][category],
		year : parseInt(year.replace('s','')),
		q : parseInt(q.replace('q', '')),
		region : region,
		category : category,
		brands : {

		}
	};

	Object.keys(dist).forEach(function(brand){
		sDist.brands[brand] = Math.round( (dist[brand] / 100 ) * sDist.count) 
	});

	return sDist;
}


module.exports = IndexBuilder;