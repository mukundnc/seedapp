grammar LibExpr;
import CommonLexerRules;

prog : stat+;

stat : ID '=' expr NEWLINE
     | expr NEWLINE
     | NEWLINE
     ;

expr : '(' expr ')'
	 | expr ('+' | '-' | '*' | '/') expr
     | ID
     | INT
     ;