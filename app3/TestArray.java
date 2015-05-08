
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.tree.*;

public class TestArray {
		
	public static void main(String[] args) {

		ANTLRInputStream stream = new ANTLRInputStream("{2,{3,9,10},4,{99,1000,100000}}");
		ArrayInitLexer lexer = new ArrayInitLexer(stream);

		CommonTokenStream tokens = new CommonTokenStream(lexer);

		ArrayInitParser parser = new ArrayInitParser(tokens);

		ParseTree tree = parser.init();

		//System.out.println(tree.toStringTree(parser));

		ParseTreeWalker walker = new ParseTreeWalker();

		walker.walk(new ShortToUnicodeString(), tree);
		System.out.println("");
	
	}		
}
