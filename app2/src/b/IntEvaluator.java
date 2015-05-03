package b;

public class IntEvaluator implements Evaluator{
	private int value = 0;

	public IntEvaluator(int value) {
		this.value = value;
	}

	@Override
	public int evaluate() {
		// TODO Auto-generated method stub
		return value;
	}		
}
