/**
 * Define a grammar called Hello
 */
grammar Sample;


program
	: 'program' IDENT '='
	  (constant | variable)*
	  'begin'
	  statement*
	  'end' IDENT '.'
	;

statement 
	: assignmentStatement
	;
	
assignmentStatement
	: IDENT ':=' expression ';'
	;
	
/*
 * term
 * negation
 * unary
 * mult
 * add
 * relation
 * expression
 */	
 
term
	: IDENT
	| '(' expression ')'
	| INTEGER
	;
	
negation
	: 'not'* term
	;	 
	
unary
	: ('+' | '-')* negation
	;
	
mult
	: unary (('*' | '/' | 'mod') unary)*
	;


add 
	: mult (('+' | '-') mult)*
	;

relation
	: add (('=' | '/=' | '<' | '<=' | '>' | '>=' ) add)*
	;
	
expression
	: relation (('and' | 'or') relation)*
	;
						
constant
	: 'constant' IDENT ':' type ':=' expression ';'
	;
variable  
	: 'var' IDENT (',' IDENT)* ':' type ';'
	;
		
type
	: 'Integer'
	;

	
INTEGER 
	: '0'..'9'+
	;
	
IDENT : ('a'..'z' | 'A'..'Z')('a'..'z' | 'A'..'Z' | '0'..'9')* ;             // match lower-case identifiers

WS : [' ' | '\t' | '\n' | '\r' | '\f']+ -> skip;
