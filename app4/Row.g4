grammar Row;

@parser::members {
	public int col;
	public RowParser(TokenStream input, int col){
		this(input);
		this.col = col;
	}
}

file : (row NL)+;


row
locals [int i = 0;] 
	: (
		STUFF {
			$i++;
			if($i == col) System.out.println($STUFF.text);
		}
	  )+
	;


NL : '\r'?'\n';
TAB : '\t' -> skip;
STUFF:  ~[\t\r\n]+; 