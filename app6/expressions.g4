grammar expressions;
import commonlexer;

expr
	: expr ('and' | '&&' expr)+
	| expr ('or' | '|' expr)+
	| expr ('>' | '>=' | '=' | '<' | '<=') (dateSpec | STRNUM | NUM | STR)
	| dateSpec
	| STRNUM
	| NUM
	| STR
	;


dateSpec 
	:	YYYY_MM_DD
	;