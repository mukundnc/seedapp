grammar expressions;
import commonlexer;

evaluate : statement EOF;

statement
	: singleStatement
	| multiStatement
	;

singleStatement
	: comparisonStatement*
	;

multiStatement 
	: multiAndOrStatement*
	;

comparisonStatement
	: STR RELATION_OPERATOR STR
	| STR RELATION_OPERATOR dateSpec
	| STRNUM RELATION_OPERATOR STR
	;

multiAndOrStatement 
	: comparisonStatement (AND_OR_OPERATOR (comparisonStatement))+
	;

dateSpec 
	:	YYYY_MM_DD
	;



