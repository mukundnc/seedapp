grammar commonlexer;

DISPLAY_PREFIX : 'show' | 'list' | 'get' | 'show all' | 'list all' | 'get all' | 'sales of';

ASSOC : 'in' | 'for' | 'sales for' | 'sales in';

FILTER_ID : 'from' | 'where' | 'sold from' | 'sold in' | 'that have' | 'that has' | 'which have' | 'which has' ;

FILTER_CONTENT : FILTER_ID .*? EOF;

YYYY_MM_DD: YEAR DATE_SPERATOR MONTH DATE_SPERATOR DAY;

WS : [' ' | '\t' | '\n' | '\r' | '\f']+ -> skip;
STR : [a-z]+;
NUM : [0-9]+;
STRNUM : STR NUM;

fragment YEAR : [2][0][0][0-9] | [2][0][1][0-5];
fragment MONTH : [0]?[0-9] | [1][0-2];
fragment DAY : [0]?[0-9] | [1-2][0-9] | [3][0-1];
fragment DATE_SPERATOR : ('/' | '-');