grammar expressions;
import commonlexer;

evaluate : expression RELATION_OPERATOR?;

term
	: 
	| '(' expression ')'
	| STR 
	| dateSpec
	| STRNUM 
	;

relation
	: term (RELATION_OPERATOR term)*
	;
	
expression
	: relation (AND_OR_OPERATOR relation)*
	;
		
dateSpec 
	:	YYYY_MM_DD
	;

