grammar commonlexer;

fragment YEAR : [2][0][0][0-9] | [2][0][1][0-5];
fragment MONTH : [0]?[0-9] | [1][0-2];
fragment DAY : [0]?[0-9] | [1-2][0-9] | [3][0-1];
fragment DATE_SPERATOR : ('/' | '-');

YYYY_MM_DD: YEAR DATE_SPERATOR MONTH DATE_SPERATOR DAY;

DISPLAY_PREFIX : 'show' | 'list' | 'get' | 'show all' | 'list all' | 'get all' | 'sales of';


ASSOC : 'in' | 'for' | 'sales for' | 'sales in';


FILTER_ID : 'where' | 'sold' | 'sold in' | 'that have' | 'that has' | 'which have' | 'which has' ;




RELATION_OPERATOR : ('=' | '!=' | '<=' | '<' | '>' | '>=' | 'is' | 'from' | 'to' | 'in last');
AND_OR_OPERATOR : ('and' | '&&' | 'or' | '|');

STR : [a-z]+;
NUM : [0-9]+;
STRNUM : STR NUM;

WS : [' ' | '\t' | '\n' | '\r' | '\f']+ -> skip;