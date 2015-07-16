require(tseries)
require(RJSONIO)
require(forecast)

execute <- function (jsonObj) {
	o = fromJSON(jsonObj);
	keys <- c();
	values <- c();
	outVals <- c();

	for(x in o$data){
		keys = append(keys, x$key);
		values = append(values, x$value);
		outVals = append(outVals, 0);
	}

	startYear <- c(o$startYear);
	if(o$frequency == 12)
		startYear <- c(o$startYear, 1);

	evalSet <- c(values[1], values[2], values[3]);
	for(i in 4:(length(values)-1)){
		evalSet = append(evalSet, values[i]);
		fVal <- getForcastValue(c(evalSet), o$frequency, startYear, o$forecastPeriod);
		if(class(fVal) == 'forecast'){
			min <- fVal$lower[1];
			max <- fVal$upper[1];
			mean <- fVal$mean['fit'];
			if(mean > 0){
				if(values[i+1] < min)
					outVals[i+1] = ((values[i+1] - mean)/mean) * 100;
			 	if(values[i+1] > max)
				 	outVals[i+1] = ((values[i+1] - mean)/mean) * 100;
			}
			# print(keys[i+1]);
			# print(values[i+1]);
			# print(min);
			# print(max);		
			# print('-----------------')
		}
	}
    results <- outVals;
    names(results) <- keys
    return(toJSON(results));
}

getForcastValue <- function (values, nFrequency, startYear, forecastCount){
	tForecast <- tryCatch({
		tsrs  <- ts(values, frequency=nFrequency, start=startYear);
		tModel <- HoltWinters(tsrs, gamma=FALSE, l.start=values[1]);
		tForecast <- forecast.HoltWinters(tModel, h=forecastCount);
		return (tForecast);
	},
	warning = function(w){
		return (0);
	},
	error = function(e){
		return (0);
	},
	finally = {
		if(exists('tForecast')){
			return (tForecast);
		}
		else{
			return (0);
		}
	});
}