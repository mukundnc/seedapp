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


NL : '\r'?'\n';
TAB : '\t' -> skip;
STUFF:  ~[\t\r\n]+; 