grammar row;


file : (row NL)+;


row
locals [var i = 0;] 
	: (
		STUFF {
			$i++;
			if($i == 2) console.log($STUFF.text);
		}
	  )+
	;

expr : expr ('*' | '/') expr          #multDiv
     | expr ('+' | '-') expr          #addSub
     | IDENT                          #ident
     | INT                            #int
     ;


IDENT : [a-zA-Z]+;
INT : [0-9]+;
NL : '\r'?'\n';
TAB : '\t' -> skip;
STUFF:  ~[\t\r\n]+; 