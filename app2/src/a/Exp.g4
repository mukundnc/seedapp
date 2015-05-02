grammar Exp;


evaluator returns [int result]
	: expression EOF { $result = $expression.result;}
	;

term  returns [int result]
	: IDENT  {$result = 0;}
	|  '(' expression ')' { $result = $expression.result;}
	| INTEGER { $result = Integer.parseInt($INTEGER.text);}
	;

unary returns [int result]
	: {int positive = 1;}
	('+' | '-' {positive = -1;})* term
	{$result = positive * $term.result;}
	;

mult  returns [int result]
	: op1=unary {$result = $op1.result;} 
		(	'*' 	op2=unary {$result = $result * $op2.result;}
		| 	'/' 	op2=unary {$result = $result / $op2.result;}
		| 	'mod' 	op2=unary {$result = $result % $op2.result;}
		)*
	;
	
expression  returns [int result]
	: op1=mult {$result = $op1.result;}
		(	'+' op2=mult {$result = $result + $op2.result;}
		| 	'-' op2=mult {$result = $result - $op2.result;}
		)*  
	;
	
	
IDENT 
	: LETTER (LETTER | DIGIT)*
	;

INTEGER
	: DIGIT+
	;
	
fragment LETTER 
	: ('a'..'z' | 'A'..'Z')
	;
fragment DIGIT
	: '0'..'9'
	;	