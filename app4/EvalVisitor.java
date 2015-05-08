
import java.util.HashMap;
import java.util.Map;

public class EvalVisitor extends LibExprBaseVisitor<Integer>{
	Map<String, Integer> memory = new HashMap<String, Integer>();
}