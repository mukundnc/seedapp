
var antlr4 = require('antlr4/index');
var QueryLexer = require('./salesLexer').salesLexer;
var QueryParser = require('./salesParser').salesParser;
var BailErrorStrategy = require('antlr4/error/ErrorStrategy').BailErrorStrategy;


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
	this.setActiveOperator(ctx);
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
		or : this.or,
		hasFilters : this.and.length > 0 || this.or.length > 0,
		hasSingleFilter : this.and.length + this.or.length === 1
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
			res = [{
				filter : {
					name : terms[0].getText(),
					operator : operators[0].getText(),
					value : terms[1].getText(),
					isDate : this.isDateRelation(atomicOrCompositeExpressionRelation)
				}
			}];
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
	var chars = new antlr4.InputStream(relation.getText());
	var lexer = new QueryLexer(chars);
	var tokens  = new antlr4.CommonTokenStream(lexer);
	var parser = new QueryParser(tokens);
	parser._errHandler = new BailErrorStrategy();
	parser.buildParseTrees = false;
	try{
		var tree = parser.parseDate();
		return true;
	}
	catch(e){
		return false;
	}
}
module.exports = ExpressionBuilder;
