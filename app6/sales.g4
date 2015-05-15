grammar sales;
import commonlexer;

query 
	: display_aspect container_in_container filter_expression?
	| display_aspect container_in_leaf filter_expression?
	| display_aspect leaf_in_container filter_expression?
	| display_aspect leaf_in_leaf filter_expression?
	;

display_aspect : displaySpec;

container_in_container 
	:	category_in_region
	|	category_in_state	
	|	type_in_region
	|	type_in_state	
	|	brand_in_region
	|	brand_in_state
	;

container_in_leaf
	:	category_in_city
	|	type_in_city
	|	brand_in_city
	;

leaf_in_container
	:	model_in_region
	|	model_in_state
	;

leaf_in_leaf
	:
	|	model_in_city
	;

category_in_region 
	: categorySpec ASSOC regionSpec
	;
category_in_state
	: categorySpec ASSOC stateSpec
	;

category_in_city
	:	categorySpec ASSOC citySpec
	;

type_in_region
	: typeSpec ASSOC regionSpec
	;

type_in_state 
	: typeSpec ASSOC stateSpec
	;

type_in_city
	: typeSpec ASSOC citySpec
	;

brand_in_region 
	: brandSpec ASSOC regionSpec
	;

brand_in_state
	: brandSpec ASSOC stateSpec
	;
brand_in_city
	: brandSpec ASSOC citySpec
	;

model_in_region
	: modelSpec ASSOC regionSpec
	;

model_in_state
	: modelSpec ASSOC stateSpec
	;

model_in_city 
	: modelSpec ASSOC citySpec
	;

filter_expression 
	:	filterSpec
	;

displaySpec : DISPLAY_PREFIX?;

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

upSpec : 'uttar' 'pradesh' | | 'uttarpradesh' | 'up';
punSpec : 'punjab' | 'pun';
harSpec : 'haryana' | 'har';
mpSpec : 'madhya' 'pradesh' | 'madhyapradesh' | 'mp';

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

filterSpec 
	: FILTER_ID expression RELATION_OPERATOR? EOF
	;

term
	: 
	| '(' expression ')'
	| categorySpec
	| typeSpec
	| brandSpec
	| modelSpec
	| regionSpec
	| stateSpec
	| citySpec 
	| dateSpec
	;

relation
	: term (RELATION_OPERATOR term)*
	;
	
expression
	: relation (AND_OR_OPERATOR relation)*
	;
		
dateSpec 
	:	YYYY_MM_DD
	;



