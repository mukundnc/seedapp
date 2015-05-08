import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.tree.*;

public class EvalTest {
		
	public static void main(String[] args) {

		ANTLRInputStream stream = new ANTLRInputStream("193 \n a=5 \n b=6 \n a+b*2 \n (1+2)*3 \n");
		LibExprLexer lexer = new LibExprLexer(stream);

		CommonTokenStream tokens = new CommonTokenStream(lexer);

		LibExprParser parser = new LibExprParser(tokens);

		ParseTree tree = parser.prog();

		EvalVisitor visitor = new EvalVisitor();
		visitor.visit(tree);

		System.out.println("done");
	
	}		
}
