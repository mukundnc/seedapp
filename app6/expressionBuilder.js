
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
	var children = ctx.expression().children;

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
		filter : {
			and : this.and,
			or : this.or
		}
	};
}

ExpressionBuilder.prototype.getExpressionItemType = function(ctx){
	if(!ctx.children) return this.expressionItemType.OPERATOR;

	if(ctx.children && ctx.children.length === 3) return this.expressionItemType.ATOMIC_RELATION;

	return this.expressionItemType.COMPOSITE_RELATION;
}

ExpressionBuilder.prototype.getFiltersFromExpressionItem = function(expItem){
	var children = expItem.children;
	var expType = this.getExpressionItemType(expItem);
	var res = undefined;
	switch (expType){
		case this.expressionItemType.ATOMIC_RELATION : 
			res = [{
				filter : {
					name : children[0].getText(),
					operator : children[1].getText(),
					value : children[2].getText()
				}
			}];
			break;
		case this.expressionItemType.COMPOSITE_RELATION : 
			res = this.getFiltersFromCompositeRelation(expItem);
			break;
	}
	return res;
}

ExpressionBuilder.prototype.getFiltersFromCompositeRelation = function(expItem){

}


ExpressionBuilder.prototype.setActiveOperator = function(ctx){
	var operators = ctx.expression().AND_OR_OPERATOR();
	if(operators[0].getText() === this.operators.OR)
		this.activeOperator = this.operators.OR;
	
}


ExpressionBuilder.prototype.build_old = function(ctx){
	var rootExpression = ctx.expression();
	this.showRelations(rootExpression);
	//this.showOperators(rootExpression);
}

ExpressionBuilder.prototype.showRelations = function(rootExpression){
	var relations = rootExpression.relation();
	if(relations){
		//console.log('found relations');
		//console.log('relation type = ' + typeof(relations));
		//console.log('here are relation keys');
		//console.log(Object.keys(relations));
		relations.forEach((function(r){
			this.showRelationInfo(r);
		}).bind(this));
	}
}

ExpressionBuilder.prototype.showOperators = function(rootExpression){
	var operators = this.rootExpression.AND_OR_OPERATOR();
	if(operators){
		console.log('found operators');
		console.log('operator type = ' + typeof(operators));
		console.log('here are operator keys')
		console.log(Object.keys(operators));
	}
}

ExpressionBuilder.prototype.showRelationInfo = function(r){
	//console.log('here are relation info keys');
	//console.log(Object.keys(r.children));
	var terms = r.term();
	console.log('found ' + Object.keys(terms).length + ' terms for relation ' + r.getText());
	terms.forEach((function(t){
		this.showTermInfo(t);
	}).bind(this));
}

ExpressionBuilder.prototype.showTermInfo = function(t){
	console.log(t.getText());
	//if(t.expression)
	//	this.build(t)	;
	if(Object.keys(t.children).length === 3) this.build(t);
}
module.exports = ExpressionBuilder;