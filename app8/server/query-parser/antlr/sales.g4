grammar sales;
import commonlexer;

query 
	| display_aspect product_spec PART FROM_FOR_IN? supplier_spec? time_spec? EOF
	| display_aspect PART FROM supplier_spec FROM_FOR_IN? product_spec?  time_spec? EOF
	| display_aspect product_spec SPEND FROM? supplier_spec? time_spec? EOF
	| display_aspect SPEND FROM_FOR_IN supplier_spec FROM_FOR_IN? product_spec?  time_spec? EOF
	| display_aspect AVERAGE product_spec PART? SPEND FROM_FOR_IN? supplier_spec? by_time_spec
	| display_aspect AVERAGE PART FROM_FOR_IN supplier_spec by_time_spec
	;

display_aspect : DISPLAY_PREFIX?;

product_spec : lineSpec | modelSpec | componentSpec;
supplier_spec : supplierNameSpec | supplierCitySpec | supplierCountrySpec;

lineSpec : 'microwave' 	| 'refrigerator'	| 'desktop pc'	| 'ac';
modelSpec : mwSpec | rfSpec | pcSpec | acSpec;

mwSpec : 'mw-2012';
rfSpec : 'rf-x-3001';
pc : 'pc-x-201';
acSpec : 'ac-3-2014';


componentSpec 
	: 'chasis-mw-01' | 'front panel-mw-01' | 'motor-mw-01' | 'controller-mw-01' | 'magnetron-mw-01' | 'wiring harness-mw-01'
	| 'power supply-mw-01' | 'door-mw-01' | 'cooling fan-mw-01' | 'metal body' | 'door' | 'compressor' | 'evaporator' | 'radiator'
	| 'controller' | 'shelfs and baskets' | 'inner shell' | 'insulation foam' | 'wiring harness' | 'door seal' | 'cabinet' | 'power supply'
	| 'hdd' | 'dvd' | 'ram' | 'motherboard' | 'cpu' | 'graphics card' | 'wireless card' | 'indoor casing' | 'evaporator' | 'fan - indoor'
	| 'controller' | 'copper tubing' | 'insulation' | 'remote' | 'indoor chasis' | 'outdoor chasis' | 'metal casing' | 'compressor'
	| 'radiator' | 'fan' | 'mountung stand' | 'air filter' | 'chasis-mw-02' | 'front panel-mw-02' | 'motor-mw-02'
	| 'controller-mw-01' | 'magnetron-mw-02' | 'wiring harness-mw-02' | 'power supply-mw-02' | 'door-mw-02' | 'cooling fan-mw-01'
	;

supplierNameSpec
	: 'demo company' | 'virtucon' | 'widget corp' | 'praxis corporation' | 'three waters' | 'galaxy corp' | 'ajax' | 'lexcorp' 
	|  'sombra corporation' | 'luthorcorp' | 'fake brothers' | 'wentworth industries' 
	| 'general products' | 'dunder mifflin' | 'atlantic northern' | 'wayne enterprises' | 'data systems' | 'smith and co.' 
	| 'barrytron' | 'milliways inc' | 'initech' | 'mainway inc' | 'the new firm' | 'klimpys' | '123 warehousing' 
	| 'krustyco'  | 'stay puft corporation' | 'roxxon' | 'sixty second corp' | 'gadgetron'
	;

time_spec : timeSpec;
by_time_spec : ;

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


