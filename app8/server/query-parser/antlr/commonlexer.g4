grammar commonlexer;

fragment YEAR : [2][0][0][0-9] | [2][0][1][0-5];
fragment MONTH : [0]?[0-9] | [1][0-2];
fragment DAY : [0]?[0-9] | [1-2][0-9] | [3][0-1];
fragment DATE_SPERATOR : ('/' | '-');

YYYY_MM_DD: YEAR DATE_SPERATOR MONTH DATE_SPERATOR DAY;

DISPLAY_PREFIX : 'show' | 'list' | 'get' | 'show all' | 'list all' | 'get all' | 'sales of';

ASSOC : 'in last' | 'between';

RELATION_OPERATOR : ('=' | '!=' | '<=' | '<' | '>' | '>=' | 'is');
AND_OR_OPERATOR : ('and' | '&&' | 'or' | '|');

FROM_FOR_IN : 'from' | 'for' | 'in';
PART : 'part' | 'parts' | 'component' | 'components' | 'part quantity' | 'parts quantity' | 'component quantity' | 'components quantity';
SPEND : 'spend';
AVERAGE : 'average';
BY_MONTH : 'by month';
BY_YEAR : 'by year';

STR : [a-z]+;
NUM : [0-9]+;
STRNUM : STR NUM;

WS : [' ' | '\t' | '\n' | '\r' | '\f']+ -> skip;