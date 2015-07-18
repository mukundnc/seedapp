grammar sales;
import commonlexer;

query 
	: display_aspect double_entity_spec ASSOC? region_spec? ASSOC? time_spec? EOF
	| display_aspect single_entity_spec ASSOC? region_spec? ASSOC? time_spec? EOF
	;

display_aspect : DISPLAY_PREFIX?;

double_entity_spec
	: category_region_spec
	| category_state_spec
	| category_city_spec 
	| type_region_spec
	| type_state_spec
	| type_city_spec 
	| brand_region_spec
	| brand_state_spec
	| brand_city_spec 
	| brand_type_spec
	| model_region_spec
	| model_state_spec
	| model_city_spec 
	| region_category_spec
	| region_type_spec
	| region_brand_spec
	| region_model_spec
	| state_category_spec
	| state_type_spec
	| state_brand_spec
	| state_model_spec
	| city_category_spec
	| city_type_spec
	| city_brand_spec
	| city_model_spec
	;

single_entity_spec
	: categorySpec (',' categorySpec)*
	| typeSpec (',' typeSpec)*
	| brandSpec (',' brandSpec)*
	| modelSpec (',' modelSpec)*
	| regionSpec (',' regionSpec)*
	| stateSpec (',' stateSpec)*
	| citySpec (',' citySpec)*
	;

region_spec 
	: regionSpec (',' regionSpec)*
	| stateSpec (',' stateSpec)*
	| citySpec (',' citySpec)*
	;	

time_spec : timeSpec;



category_region_spec : categorySpec regionSpec;
category_state_spec : categorySpec stateSpec;
category_city_spec : categorySpec citySpec; 
type_region_spec : typeSpec regionSpec;
type_state_spec : typeSpec stateSpec;
type_city_spec : typeSpec citySpec;
brand_region_spec : brandSpec regionSpec;
brand_state_spec : brandSpec stateSpec;
brand_city_spec : brandSpec citySpec; 
brand_type_spec : brandSpec typeSpec;
model_region_spec : modelSpec regionSpec;
model_state_spec : modelSpec stateSpec;
model_city_spec : modelSpec citySpec; 
region_category_spec : regionSpec categorySpec;
region_type_spec : regionSpec typeSpec;
region_brand_spec : regionSpec brandSpec;
region_model_spec : regionSpec modelSpec;
state_category_spec : stateSpec categorySpec;
state_type_spec : stateSpec typeSpec;
state_brand_spec : stateSpec brandSpec;
state_model_spec : stateSpec modelSpec;
city_category_spec : citySpec categorySpec;
city_type_spec : citySpec typeSpec;
city_brand_spec : citySpec brandSpec;
city_model_spec : citySpec modelSpec;


categorySpec
	: automibileSpec
	| electronicSpec
	| clothingSpec
	| applianceSpec
	; 


automibileSpec : 'automobile' | 'automobiles';
electronicSpec : 'electronic' | 'electronics';
clothingSpec   : 'clothing' | 'colthings' | 'cloths' | 'cloth';
applianceSpec  :  'appliance' | 'appliances';

regionSpec 
	: eastSpec
	| westSpec
	| northSpec
	| southSpec
	;

eastSpec : 'east' | 'eastern';
westSpec : 'west' | 'western';
northSpec : 'north' | 'northern';
southSpec : 'south' | 'southern';

stateSpec
	: upSpec | punSpec | harSpec | mpSpec
	| mahSpec | rajSpec | goaSpec | gujSpec
	| benSpec | odsSpec | bihSpec | jhaSpec
	| apSpec | kntkSpec | tnSpec | kerSpec;

upSpec : 'uttar pradesh' | 'uttarpradesh' | 'up';
punSpec : 'punjab' | 'pun';
harSpec : 'haryana' | 'har';
mpSpec : 'madhya pradesh' | 'madhyapradesh' | 'mp';

mahSpec : 'maharashtra' | 'mah' | 'maha' ;
rajSpec : 'rajasthan' | 'raj';
goaSpec : 'goa';
gujSpec : 'gujrat' | 'guj';

benSpec : 'bengal' | 'west bengal' | 'westbengal' | 'wb';
odsSpec : 'odhisha' | 'orissa' | 'odisa';
bihSpec : 'bihar' | 'bh';
jhaSpec : 'jharkhand' | 'jha';

apSpec : 'andhra pradesh' | 'andhrapradesh' | 'andhra' | 'ap';
kntkSpec : 'karnataka' | 'kn' | 'kt';
tnSpec : 'tamil nadu' | 'tamilnadu' | 'tamil nad' | 'tamilnad' | 'tn';
kerSpec : 'kerla' | 'ker';


typeSpec 
	: mobileSpec | tabletSpec | laptopSpec
	| shirtSpec | tshirtSpec | jeansSpec
	| refrigratorSpec | tvSpec | acSpec
	| bikeSpec | carSpec | suvSpec
	;

mobileSpec : 'mobile' | 'mobiles' | 'phones';
tabletSpec : 'tablet' | 'tablets' | 'tab' | 'tabs';
laptopSpec : 'laptop' | 'laptops' | 'laps' | 'lap';

shirtSpec : 'shirts' | 'shirt';
tshirtSpec : 'tshirts' | 'tshirt';
jeansSpec : 'jeans' | 'jean' | 'trousers' | 'trouser';

refrigratorSpec : 'fridge' | 'refrigrator' | 'refrigrators';
tvSpec : 'tvs' | 'tv' | 'television' | 'led' | 'leds';
acSpec : 'ac' | 'air conditioner' | 'acs';

bikeSpec : 'bike' | 'bikes' | 'motor cycles' | 'motorcycles' | 'motor cycle' | 'motorcycle' | '2 wheeler' | '2wheeler' | '2 wheelers' | '2wheelers';

carSpec : 'car' | 'cars' | '4 wheelers' | '4wheelers' | '4 wheeler'  | '4wheeler';
suvSpec : 'suv' | 'suvs' | 'sedans' | 'hatchbacks';


brandSpec 
	: 'apple' | 'samsung' | 'micromax' | 'xiome' | 'nokia' | 'hp' | 'dell' 
	| 'asus' | 'acer' | 'lenovo' | 'compaq' | 'vanhusen' | 'colorplus' | 'arrow' 
	| 'peterengland' | 'ralphpolo' | 'nike' | 'addidas' | 'crocodile' | 'kings' 
	| 'sfk' | 'levis' | 'wrangler' | 'stryker' | 'killer' | 'pepe' | 'godrej' 
	| 'voltas' | 'alwyn' | 'ge' | 'videocon' | 'lg' | 'sony' | 'panasonic' 
	| 'toshiba' | 'carrier' | 'lyod' | 'bluestar' | 'hitachi' | 'kenstar' 
	| 'bajaj' | 'hero' | 'kawasaky' | 'yamaha' | 'suzuki' | 'maruti' | 'hyundai' 
	| 'tata' | 'fiat' | 'skoda' | 'honda' | 'toyota' | 'bmw' | 'audi' | 'mercedes'
	;

modelSpec 
	: STR 
	| STRNUM
	| STR '-' NUM
	;

citySpec : STR;
		
timeSpec 
	: NUM (year_spec | month_spec | day_spec)
	| NUM
	| NUM AND_OR_OPERATOR NUM
	| YYYY_MM_DD
	;

year_spec : 'years' | 'year';
month_spec :  'months' | 'month';
day_spec : 'days' | 'day';


