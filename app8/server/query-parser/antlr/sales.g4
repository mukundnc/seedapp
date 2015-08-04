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
rfSpec : 'rf-2000'  | 'rf-2000l'  | 'rf-2000x'  | 'rf-2003x'  | 'rf-2003s'  | 'rf-2005'  | 'rf-2005l'  | 'rf-2008'  
	   | 'rf-2008x'  | 'rf-2008l'  | 'rf-2011'  | 'rf-2011x';
pcSpec : 'pc-x-201';
acSpec : 'ac-3-2014';


componentSpec 
	: 'metal body-2000'  | 'metal body-2000l'  | 'metal body-2000x'  | 'metal body-2003x'  | 'metal body-2005'  | 'metal body-2005l'  
	| 'metal body-2008'  | 'metal body-2008x'  | 'metal body-2008l'  | 'metal body-2011'  | 'metal body-2011x'  | 'door-2000'  
	| 'door-2000l'  | 'door-2000x'  | 'door-2003x'  | 'door-2005'  | 'door-2005l'  | 'door-2008'  | 'door-2008x'  | 'door-2008l'  
	| 'door-2011'  | 'door-2011x'  | 'compressor-2000'  | 'compressor-2003x'  | 'compressor-2005'  | 'compressor-2005l'  
	| 'compressor-2008x'  | 'compressor-2008l'  | 'compressor-2011'  | 'compressor-2011x'  | 'evaporator-2000'  | 'evaporator-2003x'  
	| 'evaporator-2005'  | 'evaporator-2008'  | 'evaporator-2008x'  | 'evaporator-2011'  | 'evaporator-2011x'  | 'radiator-2000'  
	| 'radiator-2003x'  | 'radiator-2005'  | 'radiator-2008'  | 'radiator-2008x'  | 'radiator-2011'  | 'radiator-2011x'  
	| 'controller-2000'  | 'controller-2003x'  | 'controller-2005'  | 'controller-2005l'  | 'controller-2008x'  | 'controller-2008l'  
	| 'controller-2011'  | 'controller-2011x'  | 'shelf-2000'  | 'shelf-2000l'  | 'shelf-2000x'  | 'shelf-2003x'  | 'shelf-2005'  
	| 'shelf-2005l'  | 'shelf-2008'  | 'shelf-2008x'  | 'shelf-2008l'  | 'shelf-2011'  | 'shelf-2011x'  | 'inner shell-2000'  
	| 'inner shell-2000l'  | 'inner shell-2000x'  | 'inner shell-2003x'  | 'inner shell-2005'  | 'inner shell-2005l'  
	| 'inner shell-2008'  | 'inner shell-2008x'  | 'inner shell-2008l'  | 'inner shell-2011'  | 'inner shell-2011x'  
	| 'insulation foam-2000'  | 'insulation foam-2000l'  | 'insulation foam-2000x'  | 'insulation foam-2003x'  | 'insulation foam-2005'  | 'insulation foam-2005l'  | 'insulation foam-2008'  | 'insulation foam-2008x'  | 'insulation foam-2008l'  | 'insulation foam-2011'  | 'insulation foam-2011x'  | 'wiring harness-2000'  | 'wiring harness-2003x'  | 'wiring harness-2005'  | 'wiring harness-2005l'  
	| 'wiring harness-2008'  | 'wiring harness-2008x'  | 'wiring harness-2008l'  | 'wiring harness-2011'  | 'wiring harness-2011x'  
	| 'door seal-2000'  | 'door seal-2000l'  | 'door seal-2000x'  | 'door seal-2003x'  | 'door seal-2005'  | 'door seal-2008'  
	| 'door seal-2008x'  | 'door seal-2008l'  | 'door seal-2011'  | 'door seal-2011x'  | 'chasis-mw-01'  | 'front panel-mw-01'  
	| 'motor-mw-01'  | 'controller-mw-01'  | 'magnetron-mw-01'  | 'wiring harness-mw-01'  | 'power supply-mw-01'  | 'door-mw-01'  
	| 'cooling fan-mw-01'  | 'turntable-mw-01'  | 'motor-mw-02'  | 'magnetron-mw-03'  | 'power supply-mw-03'  | 'cooling fan-mw-03'  
	| 'chasis-mw-03'  | 'front panel-mw-03'  | 'controller-mw-03'  | 'wiring harness-mw-03'  | 'door-mw-03'  | 'motor-mw-04'  
	| 'magnetron-mw-04x'  | 'power supply-mw-04x'  | 'cooling fan-mw-04x'  | 'chasis-mw-04'  | 'front panel-mw-04'  
	| 'controller-mw-04'  | 'wiring harness-mw-04'  | 'door-mw-04'  | 'turntable-mw-04'  | 'chasis-mw-07'  | 'front panel-mw-07'  
	| 'motor-mw-09'  | 'magnetron-mw-09'  | 'power supply-mw-09'  | 'cooling fan-mw-09'  | 'door-mw-07'  | 'turntable-mw-07'  
	| 'chasis-mw-09'  | 'front panel-mw-09'  | 'controller-mw-09'  | 'wiring harness-mw-09'  | 'door-mw-09'  | 'turntable-mw-09'
	;

supplierNameSpec
	: 'barrytron'  | 'demo company'  | 'leeding engines ltd.'  | 'petrox metal works'  | 'chez quis'  | 'roboto industries'  
	| 'sombra corporation'  | 'virtucon'  | 'springshield'  | 'taco grande inc'  | 'western metal works'  | 'ankh-sto associates'  
	| 'luthorcorp'  | 'general services corporation'  | 'colonial inc'  | 'gadgetron'  | 'osato solutions'  | 'rouster and sideways'  
	| 'niagular'  | 'sample company'  | 'strickland solutions inc'  | 'chasers'  | 'general forge and foundry'  
	| 'charles townsend agency'  | 'fake brothers'  | 'initrode'  | 'industrial automation'  | 'mr. sparkle'  
	| 'thrift routing solutions'  | 'the krusty krab'  | 'stay puft corporation'  | 'wentworth industries'  | 'videlectrix'  
	| 'allied llc'  | 'axis specialities'  | 'big t ltd'  | 'the electronics warehouse'  | 'general products'  | 'minuteman llc'  
	| 'initech'  | 'praxis corporation'  | 'the new firm'  | 'nordyne defense dynamics'  | 'power corp'  | 'united electronics'  
	| 'atlantic northern'  | 'demo, inc.'  | 'bluth company'  | 'dunder mifflin'  | 'lexcorp'  | 'megadodo moldings'  
	| 'the legitimate businessmens club'  | 'wernham hogg'  | 'u.s. robotics and mechanical men'  | 'xyz corp'  | 'globo-brothers'  
	| 'gizmonic industries'  | 'gringotts'  | 'central perk'  | 'mainway inc'  | 'klimpys'  | 'powell motors'  | 'spacely llc'  
	| 'sixty second corp'  | 'st. anky specialities'  | 'wayne enterprises'  | 'foo bars'  | 'galaxy corp'  | 'data systems'  
	| 'cogswell llc'  | 'mcmahon and tate'  | 'keedsler motors'  | 'input, inc.'  | 'moes wires'  | 'mooby corp'  | 'chotchkies'  
	| 'extensive enterprise'  | 'carrys components'  | 'blammo'  | 'primatech'  | 'mammoth llc'  | 'roxxon'  | 'sto plains holdings'  
	| 'smith and co.'  | 'tip top plc'  | 'ajax'  | '123 warehousing'  | 'globo dyn american corp'  | 'three waters'  
	| 'bland corporation'  | 'abc corp'  | 'incom corporation'  | 'big kahuna inc'  | 'milliways inc'  | 'omni consumer products'  
	| 'universal electricals'  | 'widget corp'  | 'krustyco'  | 'tessier-ashpool'  | 'acme corp'
	;

supplierCitySpec
	: 'birmingham'  | 'sydney'  | 'shanghai'  | 'hangzhou'  | 'leverpool'  | 'dusseldorf'  | 'munich'  | 'rio de janeiro'  | 'kolkata'  
	| 'nice'  | 'beijing'  | 'shenzhen'  | 'kobe'  | 'turin'  | 'manchester'  | 'florence'  | 'tokyo'  | 'chennai'  | 'guadalajara'  
	| 'detroit'  | 'perth'  | 'ecatepec'  | 'delhi'  | 'brisbane'  | 'salvador'  | 'seattle'  | 'tianjin'  | 'nagoya'  | 'lyon'  
	| 'tijuana'  | 'houston'  | 'catania'  | 'mumbai'  | 'fortaleza' 
	;

supplierCountrySpec
	: 'uk'  | 'australia'  | 'china'  | 'germany'  | 'brazil'  | 'india'  | 'france'  | 'japan'  | 'italy'  | 'mexico'  | 'us' 
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


