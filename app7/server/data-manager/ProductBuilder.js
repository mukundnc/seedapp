var _ = require('underscore');
var logger = require('./../utils/Logger');
var dictonary = require('./../../config/Dictionary');
var Customers = require('./Customers');
var Products = require('./Products');
var Regions = require('./Regions');
var space = '  ';

function ProductBuilder(){

}

ProductBuilder.prototype.getSalesProducts = function(saleStrategy){
	this.saleStrategy = saleStrategy;
	var self = this;
	var sYKeys = Object.keys(saleStrategy.sales.region_category);
	var sQKeys = ['q1', 'q2', 'q3', 'q4'];
	var sRKeys = ['east', 'west', 'north', 'south'];
	var sCKeys = ['automobiles', 'electronics', 'appliances', 'cloths'];

	//sYKeys = ['s2000'];
	//sQKeys = [sQKeys[0]];
	//sRKeys = [sRKeys[0]];
	//sCKeys = [sCKeys[0]];
	var sales = [];
	sYKeys.forEach(function(sYkey){
		sQKeys.forEach(function(sQKey){
			sRKeys.forEach(function(sRKey){
				sCKeys.forEach(function(sCKey){
					var pArr = self.getSalesProductsForYearQuarterRegionCategory(sYkey, sQKey, sRKey, sCKey);
					sales = sales.concat(pArr);
				});
			});
		});
	});

	console.log(sales.length);
	return sales;
}

ProductBuilder.prototype.getSalesProductsForYearQuarterRegionCategory = function(year, q, region, category){
	var dist = this.getBrandDistribution(year, q, category);
	if(!dist){
		logger.log('No distribution found for - ' + year + space + q + space + region + space + category);
		return [];
	}
	var salesDistDetails = this.getSalesDistributionDetails(year, q, region, category, dist);
	
	products = [];
	Object.keys(salesDistDetails.brands).forEach((function(brand){
		if(salesDistDetails.brands[brand] > 0){
			products = products.concat(this.getProductsByBrandName(brand, salesDistDetails.brands[brand]));
		}
	}).bind(this));

	var dates = this.getDateInstances(year, q, products.length);
	var regions = this.getRegionInstances(region, products.length);
	var customers = this.getCustomerInstances(products.length);

	var salesProducts = [];
	products.forEach(function(p){
		salesProducts.push({
			product : p,
			customer : customers.pop(),
			region : regions.pop(),
			timestamp : dates.pop()
		});
	});

	return salesProducts;
}

ProductBuilder.prototype.getBrandDistribution = function(year, q, category){
	var cYKey = year.replace('s', 'c');
	return this.saleStrategy.sales.category_brands[cYKey][q][category];
}

ProductBuilder.prototype.getSalesDistributionDetails = function(year, q, region, category, dist){
	var sDist = {
		count : this.saleStrategy.sales.region_category[year][q][region][category],
		year : parseInt(year.replace('s','')),
		q : parseInt(q.replace('q', '')),
		region : region,
		category : category,
		brands : {}
	};

	Object.keys(dist).forEach(function(brand){
		sDist.brands[brand] = Math.round( (dist[brand] / 100 ) * sDist.count) 
	});

	return sDist;
}

ProductBuilder.prototype.getProductsByBrandName = function(brand, count){
	if(count === 0) return [];

	var prods = _.where(Products, {'brand' : dictonary.getDomainQualifiedStr(brand)});
	while(prods.length < count)
		prods = prods.concat(prods);

	prods = this.shuffleArray(prods);
	prods = prods.splice(0, count);

	return prods;
}

ProductBuilder.prototype.getDateInstances = function(year, q, count){
	var months = [];
	var y = year.replace('s','');
	switch(q){
		case 'q1' : months = ['01', '02', '03']; break;
		case 'q2' : months = ['04', '05', '06']; break;
		case 'q3' : months = ['07', '08', '09']; break;
		case 'q4' : months = ['10', '11', '12']; break;
	}
	var days = [];
	for(var i = 1 ; i < 31 ; i++){
		if( i < 10)
			days.push('0' + i);
		else
			days.push(i.toString());
	}
	var dates = [];
	months.forEach(function(m){
		days.forEach(function(d){
			if( q === 'q1' && m === '02' && parseInt(d) > 28)
				d = '28';
			dates.push(y + '/' + m + '/' + d);
		});
	});

	while(dates.length < count)
		dates = dates.concat(dates);
	dates = dates.splice(0, count);
	dates = this.shuffleArray(dates);
	return dates;
}

ProductBuilder.prototype.getRegionInstances = function(region, count){
	var rgns = _.where(Regions, { region : dictonary.getDomainQualifiedStr(region)});

	while(rgns.length < count)
		rgns = rgns.concat(rgns);
	rgns = rgns.splice(0, count);
	rgns = this.shuffleArray(rgns);
	return rgns;
}

ProductBuilder.prototype.getCustomerInstances = function(count){
	var c = Customers.slice(0);
	while(c.length < count)
		c = c.concat(c);
	c = c.splice(0, count);
	return c;
}

ProductBuilder.prototype.shuffleArray = function(o){
	for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

module.exports = ProductBuilder;