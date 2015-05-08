grammar LibExpr;
import CommonLexerRules;

prog : stat+;

stat : ID EQUALS expr NEWLINE
     | expr NEWLINE
     | NEWLINE
     ;

expr : LPAREN expr RPAREN
	 | expr (ADD | SUB | MUL | DIV) expr
     | ID
     | INT
     ;