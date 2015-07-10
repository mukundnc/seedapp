require(tseries)
require(RJSONIO)
require(forecast)

execute <- function (jsonObj) {
	o = fromJSON(jsonObj);
	keys <- c();
	values <- c();
	outVals <- c();

	for(x in o$data){
		keys = append(keys, as.numeric(x$key));
		values = append(values, x$value);
		outVals = append(outVals, 0);
	}
	evalSet <- c(values[1], values[2], values[3]);
	for(i in 4:(length(values)-1)){
		evalSet = append(evalSet, values[i]);
		fVal <- getForcastValue(c(evalSet), keys, o$forecastPeriod);
		
		min <- fVal$lower[1];
		max <- fVal$upper[1];
		if(values[i+1] < min)
			outVals[i+1] = -1;
	 	if(values[i+1] > max)
		 	outVals[i+1] = 1;
		# print(keys[i+1]);
		# print(values[i+1]);
		# print(min);
		# print(max);		
		# print('-----------------')
	}
    results <- outVals;
    names(results) <- keys
    return(toJSON(results));
}

getForcastValue <- function (values, keys, forecastCount){
	tsrs  <- ts(values, start=c(keys[1]));
	tModel <- HoltWinters(tsrs, gamma=FALSE, l.start=values[1]);
	tForecast <- forecast.HoltWinters(tModel, h=forecastCount)
	return (tForecast);
}