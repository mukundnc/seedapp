grammar sales;
import commonlexer;

query 
	: display_aspect product_spec part_spec? FROM_FOR_IN? supplier_spec? ASSOC? time_spec? EOF
	| display_aspect part_spec FROM_FOR_IN supplier_spec FROM_FOR_IN? product_spec?  ASSOC? time_spec? EOF
	| display_aspect product_spec part_spec? spend_spec FROM_FOR_IN? supplier_spec? ASSOC? time_spec? EOF
	| display_aspect spend_spec FROM_FOR_IN supplier_spec FROM_FOR_IN? product_spec?  ASSOC? time_spec? EOF
	| display_aspect average_spec product_spec part_spec? spend_spec FROM_FOR_IN? supplier_spec? by_time_spec
	| display_aspect average_spec part_spec FROM_FOR_IN supplier_spec by_time_spec
	;

display_aspect : DISPLAY_PREFIX?;

product_spec 
	: lineSpec (',' lineSpec)?
	| modelSpec  (',' modelSpec)?
	| componentSpec (',' componentSpec)?
	;

supplier_spec 
	: supplierNameSpec (',' supplierNameSpec)? 
	| supplierCitySpec (',' supplierCitySpec)? 
	| supplierCountrySpec (',' supplierCountrySpec)?
	;

part_spec : PART;
spend_spec : SPEND;
average_spec : AVERAGE;

lineSpec : 'microwave' 	| 'refrigerator'	| 'desktop pc'	| 'ac';
modelSpec : mwSpec | rfSpec | pcSpec | acSpec;

mwSpec : 'mw-2000'  | 'mw-2000x'  | 'mw-2003'  | 'mw-2004'  | 'mw-2004x'  | 'mw-2007'  | 'mw-2009';
rfSpec : 'rf-x-3001';
pcSpec : 'pc-x-201';
acSpec : 'ac-3-2014';


componentSpec 
	: 'chasis-mw-01'  | 'front panel-mw-01'  | 'motor-mw-01'  | 'controller-mw-01'  | 'magnetron-mw-01'  | 'wiring harness-mw-01'  
	| 'power supply-mw-01'  | 'door-mw-01'  | 'cooling fan-mw-01'  | 'turntable-mw-01'  | 'motor-mw-02'  | 'magnetron-mw-03'  
	| 'power supply-mw-03'  | 'cooling fan-mw-03'  | 'chasis-mw-03'  | 'front panel-mw-03'  | 'controller-mw-03'  
	| 'wiring harness-mw-03'  | 'door-mw-03'  | 'motor-mw-04'  | 'magnetron-mw-04x'  | 'power supply-mw-04x'  | 'cooling fan-mw-04x'  
	| 'chasis-mw-04'  | 'front panel-mw-04'  | 'controller-mw-04'  | 'wiring harness-mw-04'  | 'door-mw-04'  | 'turntable-mw-04'  
	| 'chasis-mw-07'  | 'front panel-mw-07'  | 'motor-mw-09'  | 'magnetron-mw-09'  | 'power supply-mw-09'  | 'cooling fan-mw-09'  
	| 'door-mw-07'  | 'turntable-mw-07'  | 'chasis-mw-09'  | 'front panel-mw-09'  | 'controller-mw-09'  | 'wiring harness-mw-09'  
	| 'door-mw-09'  | 'turntable-mw-09'
	;

supplierNameSpec
	: 'ankh-sto associates'  | 'roboto industries'  | 'ajax'  | '123 warehousing'  | 'globo dyn american corp'  | 'galaxy corp'  
	| 'three waters'  | 'bluth company'  | 'bland corporation'  | 'abc corp'  | 'chez quis'  | 'klimpys'  | 'axis specialities'  
	| 'incom corporation'  | 'springshield'  | 'big kahuna inc'  | 'moes wires'  | 'dunder mifflin'  | 'milliways inc'  
	| 'omni consumer products'  | 'petrox metal works'  | 'general products'  | 'megadodo moldings'  | 'universal electricals'  
	| 'virtucon'  | 'widget corp'  | 'atlantic northern'  | 'krustyco'  | 'initech'  | 'tessier-ashpool'  | 'demo, inc.'  | 'acme corp'  
	| 'minuteman llc'  | 'wernham hogg'  | 'barrytron'  | 'allied llc'  | 'demo company'  | 'big t ltd'  | 'praxis corporation'  
	| 'lexcorp'  | 'sombra corporation'  | 'taco grande inc'  | 'u.s. robotics and mechanical men'
	;

supplierCitySpec
	: 'shenzhen'  | 'kobe'  | 'turin'  | 'nice'  | 'beijing'  | 'manchester'  | 'florence'  | 'munich'  | 'sydney'  | 'tokyo'  
	| 'hangzhou'  | 'chennai'  | 'guadalajara'  | 'detroit'  | 'rio de janeiro'  | 'shanghai'  | 'perth'  | 'ecatepec'  | 'delhi'  
	| 'brisbane'  | 'salvador'  | 'birmingham'  | 'seattle'  | 'tianjin'  | 'kolkata'  | 'nagoya'  | 'lyon'  | 'tijuana'  | 'houston'  
	| 'catania'  | 'mumbai'  | 'dusseldorf'  | 'fortaleza' 
	;

supplierCountrySpec
	: 'china'  | 'japan'  | 'italy'  | 'france'  | 'uk'  | 'germany'  | 'australia'  | 'india'  | 'mexico'  | 'us'  | 'brazil' 
	;


time_spec : timeSpec;
by_time_spec : BY_MONTH | BY_YEAR;

timeSpec 
	: timeInLastYearsSpec
	| timeInLastMonthsSpec
	| timeInLastDaysSpec
	| timeInYearSpec
	| timeBetweenYearsSpec
	| timeBetweenDatesSpec
	;

timeInLastYearsSpec : NUM year_spec;
timeInLastMonthsSpec : NUM month_spec;
timeInLastDaysSpec : NUM day_spec;
timeInYearSpec : NUM;
timeBetweenYearsSpec : NUM AND_OR_OPERATOR NUM;
timeBetweenDatesSpec : YYYY_MM_DD AND_OR_OPERATOR YYYY_MM_DD;


year_spec : 'years' | 'year';
month_spec :  'months' | 'month';
day_spec : 'days' | 'day';


