
var antlr4 = require('antlr4/index');


function ExpressionBuilder(){
	this.operators = {
		EQ : '=',
		NE : '!=',
		GT : '>',
		GE : '>=',
		LT : '<',
		LE : '<=',
		AND : 'and',
		OR : 'or'
 	};
 	this.expressionItemType = {
 		OPERATOR : 1,
 		ATOMIC_RELATION : 2,
 		COMPOSITE_RELATION : 3
 	};
 	this.and = [];
 	this.or = [];
 	this.activeOperator = this.operators.AND;
}

ExpressionBuilder.prototype.build = function(ctx){
	//this.setActiveOperator(ctx);
	var relations = ctx.expression().relation();
	var operators = ctx.expression().AND_OR_OPERATOR();
	var i = 0;
	var children = [];

	while(i < relations.length){
		children.push(relations[i]);
		if(i < operators.length)
			children.push(operators[i]);
		++i;
	}

	children.forEach((function(c){
		if(this.expressionItemType.OPERATOR === this.getExpressionItemType(c)){
			c.getText() === this.operators.AND? 
								this.activeOperator = this.operators.AND:
								this.activeOperator = this.operators.OR ;
		}
		else{
			var arr = this.getFiltersFromExpressionItem(c);
			this.activeOperator === this.operators.AND? 
										this.and = this.and.concat(arr):
										this.or = this.or.concat(arr) ;
		}
	}).bind(this));
	
	

	return {
		and : this.and,
		or : this.or
	};
}

ExpressionBuilder.prototype.getExpressionItemType = function(relationOrOperator){
	if(!relationOrOperator.children) return this.expressionItemType.OPERATOR;

	var terms = relationOrOperator.term();
	var operators = relationOrOperator.RELATION_OPERATOR();

	if(terms && terms.length === 2 && operators && operators.length ===1) 
		return this.expressionItemType.ATOMIC_RELATION;

	return this.expressionItemType.COMPOSITE_RELATION;
}

ExpressionBuilder.prototype.getFiltersFromExpressionItem = function(atomicOrCompositeExpressionRelation){
	var children = atomicOrCompositeExpressionRelation.children;
	var expType = this.getExpressionItemType(atomicOrCompositeExpressionRelation);
	var res = undefined;
	switch (expType){
		case this.expressionItemType.ATOMIC_RELATION : 
			var terms = atomicOrCompositeExpressionRelation.term();
			var operators = atomicOrCompositeExpressionRelation.RELATION_OPERATOR();
			var isDateRelation = this.isDateRelation(atomicOrCompositeExpressionRelation);
			if(isDateRelation){
				res = this.getFiltersForDateRelation(atomicOrCompositeExpressionRelation);
			}
			else{			
				res = [{
					filter : {
						name : terms[0].getText(),
						operator : operators[0].getText(),
						value : terms[1].getText(),
						isDate : false
					}
				}];
			}
			break;
		case this.expressionItemType.COMPOSITE_RELATION : 
			res = this.getFiltersFromCompositeRelation(atomicOrCompositeExpressionRelation);
			break;
	}
	return res;
}

ExpressionBuilder.prototype.getFiltersFromCompositeRelation = function(compositeExpressionRelation){
	var relations = compositeExpressionRelation.term(0).expression().relation();
	var arr = [];
	relations.forEach((function(r){
		arr = arr.concat(this.getFiltersFromExpressionItem(r));
	}).bind(this));

	return arr;
}


ExpressionBuilder.prototype.setActiveOperator = function(ctx){
	var operators = ctx.expression().AND_OR_OPERATOR();
	if(operators[0].getText() === this.operators.OR)
		this.activeOperator = this.operators.OR;
	
}

ExpressionBuilder.prototype.isDateRelation = function(relation){
	var terms = relation.term();
	if(!terms) return false;

	for (var i = 0; i < terms.length; i++) {
		if(terms[i].dateSpec()){
			return true;
		}
	};

	return false;
}

ExpressionBuilder.prototype.getFiltersForDateRelation = function(atomicOrCompositeExpressionRelation){
	var terms = atomicOrCompositeExpressionRelation.term();
	var operators = atomicOrCompositeExpressionRelation.RELATION_OPERATOR();
	var op = operators[0].getText();
	var filterValue = terms[1].getText();
	var filters = [];
	if(op === 'from' || op === 'to'){
		filters.push({
			filter : {
				name : terms[0].getText(),
				operator : op,
				value : filterValue,
				isDate : true
			}
		});
	}
	else{
		if(op === 'is' || op === '=')
			filters = this.getFiltersForYearDateRelation(atomicOrCompositeExpressionRelation)
		else if(filterValue.indexOf('years') !== -1 || filterValue.indexOf('year') !== -1)
			filters = this.getFiltersForInLastYearsDateRelation(atomicOrCompositeExpressionRelation);
		else if(filterValue.indexOf('months') !== -1 || filterValue.indexOf('month') !== -1)
			filters = this.getFiltersForInLastMonthsDateRelation(atomicOrCompositeExpressionRelation);
		else if(filterValue.indexOf('days') !== -1 || filterValue.indexOf('day') !== -1)
			filters = this.getFiltersForInLastDaysDateRelation(atomicOrCompositeExpressionRelation);
	}
	return filters;
}

ExpressionBuilder.prototype.getFiltersForYearDateRelation = function(atomicOrCompositeExpressionRelation){
	var terms = atomicOrCompositeExpressionRelation.term();
	var operators = atomicOrCompositeExpressionRelation.RELATION_OPERATOR();
	var op = operators[0].getText();
	var filterValue = terms[1].getText();
	var filters = [];
	filters.push({
		filter : {
			name : 'date',
			operator : 'from',
			value : filterValue + '/01/01',
			isDate : true
		}
	});
	filters.push({
		filter : {
			name : 'date',
			operator : 'to',
			value : filterValue + '/12/31',
			isDate : true
		}
	});
	return filters;
}

ExpressionBuilder.prototype.getFiltersForInLastYearsDateRelation = function(atomicOrCompositeExpressionRelation){
	var terms = atomicOrCompositeExpressionRelation.term();
	var operators = atomicOrCompositeExpressionRelation.RELATION_OPERATOR();
	var op = operators[0].getText();
	var filterValue = terms[1].getText();
	var nVal = parseInt(filterValue.match(/\d+/)[0]);
	var year = 2014 - nVal + 1;
	var filters = [];
	filters.push({
		filter : {
			name : 'date',
			operator : 'from',
			value : year + '/01/01',
			isDate : true
		}
	});
	filters.push({
		filter : {
			name : 'date',
			operator : 'to',
			value : '2014/12/31',
			isDate : true
		}
	});
	return filters;
}

ExpressionBuilder.prototype.getFiltersForInLastMonthsDateRelation = function(atomicOrCompositeExpressionRelation){
	var terms = atomicOrCompositeExpressionRelation.term();
	var operators = atomicOrCompositeExpressionRelation.RELATION_OPERATOR();
	var op = operators[0].getText();
	var filterValue = terms[1].getText();
	var filters = [];
	var nVal = parseInt(filterValue.match(/\d+/)[0]);
	var tsnMonthsBack = Date.parse('2014/12/31') - (1000 * 60 * 60 * 24 * 30.5 * nVal);
	var dtnMonthsBack = new Date(tsnMonthsBack);
	filters.push({
		filter : {
			name : 'date',
			operator : 'from',
			value : dtnMonthsBack.getFullYear() + '/' + (dtnMonthsBack.getMonth() + 1) + '/' + dtnMonthsBack.getDate(),
			isDate : true
		}
	});
	filters.push({
		filter : {
			name : 'date',
			operator : 'to',
			value : '2014/12/31',
			isDate : true
		}
	});
	return filters;
}

ExpressionBuilder.prototype.getFiltersForInLastDaysDateRelation = function(atomicOrCompositeExpressionRelation){
	var terms = atomicOrCompositeExpressionRelation.term();
	var operators = atomicOrCompositeExpressionRelation.RELATION_OPERATOR();
	var op = operators[0].getText();
	var filterValue = terms[1].getText();
	var filters = [];
	var nVal = parseInt(filterValue.match(/\d+/)[0]);
	var tsnDaysBack = Date.parse('2014/12/31') - (1000 * 60 * 60 * 24 * nVal);
	var dtnDaysBack = new Date(tsnDaysBack);
	filters.push({
		filter : {
			name : 'date',
			operator : 'from',
			value : dtnDaysBack.getFullYear() + '/' + (dtnDaysBack.getMonth() + 1) + '/' + dtnDaysBack.getDate(),
			isDate : true
		}
	});
	filters.push({
		filter : {
			name : 'date',
			operator : 'to',
			value : '2014/12/31',
			isDate : true
		}
	});
	return filters;
}

module.exports = ExpressionBuilder;

