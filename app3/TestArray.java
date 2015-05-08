import org.antlr.v4.runtime.ANTLRInputStream;
import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.CommonTokenStream;
import org.antlr.v4.runtime.TokenStream;
import org.antlr.v4.runtime.tree.ParseTree;

public class TestArray {
		
	public static void main(String[] args) {

		ANTLRInputStream stream = new ANTLRInputStream("{2 , {  3    ,  9,   10  },4,     {      99  , 1000,  100000}}");
		ArrayInitLexer lexer = new ArrayInitLexer(stream);

		CommonTokenStream tokens = new CommonTokenStream(lexer);

		ArrayInitParser parser = new ArrayInitParser(tokens);

		ParseTree tree = parser.init();

		System.out.println(tree.toStringTree(parser));
	
	}		
}
