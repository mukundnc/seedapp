grammar LibExpr;
import CommonLexerRules;

prog : stat+;

stat : ID EQUALS expr NEWLINE             # assign
     | expr NEWLINE                       # printExpr
     | NEWLINE                            # blank
     ;

expr : LPAREN expr RPAREN                 # parens
	 | expr (ADD | SUB) expr              # AddSub
	 | expr (MUL | DIV) expr              # MulDiv
     | ID                                 # id
     | INT                                # int
     ;

