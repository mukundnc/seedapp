grammar LibExpr;
import CommonLexerRules;

prog : stat+;

stat : ID EQUALS expr NEWLINE             # assign
     | expr NEWLINE                       # printExpr
     | NEWLINE                            # blank
     ;

expr : LPAREN expr RPAREN                 # parens
	 | expr op=(MUL | DIV) expr           # MulDiv
	 | expr op=(ADD | SUB) expr           # AddSub
     | ID                                 # id
     | INT                                # int
     ;

