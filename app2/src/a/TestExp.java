package a;

import org.antlr.v4.runtime.ANTLRInputStream;
import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.CommonTokenStream;
import org.antlr.v4.runtime.TokenStream;

import a.ExpParser.EvaluatorContext;
import a.ExpParser.EvaluatornewContext;





public class TestExp {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		CharStream stream = new ANTLRInputStream("--3--2");
		ExpLexer lexer = new ExpLexer (stream);
		TokenStream tokenStream = new CommonTokenStream(lexer);
		ExpParser parser = new ExpParser(tokenStream);
		EvaluatorContext result = parser.evaluator();
		EvaluatornewContext resultNew = parser.evaluatornew();
		System.out.println("I am ok result = " + result.result);
		System.out.println("I am ok new result = " + resultNew.e.evaluate());
	}

}
