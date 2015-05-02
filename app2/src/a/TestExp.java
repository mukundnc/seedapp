package a;

import org.antlr.v4.runtime.ANTLRInputStream;
import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.CommonTokenStream;
import org.antlr.v4.runtime.TokenStream;

import a.ExpParser.EvaluatorContext;




public class TestExp {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		CharStream stream = new ANTLRInputStream("--3--2");
		ExpLexer lexer = new ExpLexer (stream);
		TokenStream tokenStream = new CommonTokenStream(lexer);
		ExpParser parser = new ExpParser(tokenStream);
		EvaluatorContext result = parser.evaluator();
		System.out.println("I am ok result = " + result.result);
	}

}
