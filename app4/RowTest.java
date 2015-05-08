
import org.antlr.v4.runtime.ANTLRInputStream;
import org.antlr.v4.runtime.CommonTokenStream;
import org.antlr.v4.runtime.ParserRuleContext;
import org.antlr.v4.runtime.Token;

import java.io.FileInputStream;
import java.io.InputStream;

public class RowTest {
    public static void main(String[] args) throws Exception {
    	String strInput = "  Vish  al Shar  ma\twakad\n  Prasa  nna Deshpa  nde\tkothrud\n  Yatis  h Gu  pta\tandheri\n";
    	

        ANTLRInputStream input = new ANTLRInputStream(strInput);
        RowLexer lexer = new RowLexer(input);
        CommonTokenStream tokens = new CommonTokenStream(lexer);
        int col = 2;
        RowParser parser = new RowParser(tokens, col); // pass column number!
        parser.setBuildParseTree(false); // don't waste time bulding a tree
        parser.file(); // parse
    }
}

			