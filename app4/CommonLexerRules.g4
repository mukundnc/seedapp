grammar CommonLexerRules;

INT     : [0-9]+;
ID      : [a-zA-Z]+ (INT+)?;
NEWLINE : '\r'? '\n';
WS      : [' ' | '\t' | '\f'] -> skip;

EQUALS : '=';
ADD : '+';
SUB : '-';
MUL : '*';
DIV : '/';     

LPAREN : '(';
RPAREN : ')';


