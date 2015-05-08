
import java.util.HashMap;
import java.util.Map;

public class EvalVisitor extends LibExprBaseVisitor<Integer>{
	Map<String, Integer> memory = new HashMap<String, Integer>();

	@Override
	public Integer visitAssign(LibExprParser.AssignContext ctx){
		String id = ctx.ID().getText();
		Integer value = visit(ctx.expr());
		memory.put(id, value);
		return value;
	}

	@Override
	public Integer visitPrintExpr(LibExprParser.PrintExprContext ctx){
		Integer value = visit(ctx.expr());
		System.out.println(value);
		return 0;
	}

	@Override
	public Integer visitId(LibExprParser.IdContext ctx){
		String id = ctx.ID().getText();
		if(memory.containsKey(id)) 
			return memory.get(id);
		return 0;
	}

	@Override
	public Integer visitInt(LibExprParser.IntContext ctx){
		Integer value = Integer.parseInt(ctx.INT().getText());
		System.out.println(value);
		return value;
	}

	@Override
	public Integer visitAddSub(LibExprParser.AddSubContext ctx){
		int left = visit(ctx.expr(0));
		int right = visit(ctx.expr(1));
		if(ctx.op.getType() == LibExprParser.ADD)
			return left + right;
		else
			return left - right;
	}

	@Override
	public Integer visitParens(LibExprParser.ParensContext ctx){
		return visit(ctx.expr());
	}

	@Override
	public Integer visitMulDiv(LibExprParser.MulDivContext ctx){
		int left = visit(ctx.expr(0));
		int right = visit(ctx.expr(1));
		if(ctx.op.getType() == LibExprParser.MUL)
			return left * right;
		else
			return left / right;
	}
}