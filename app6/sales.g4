grammar sales;

query : display_aspect? container_in_container;

display_aspect : 'show' 'all' | 'list' 'all' | 'get' 'all' | 'sales' 'of' | 'list';

container_in_container 
	:	category_in_region
	|	category_in_state
	|	category_in_city
	|	type_in_region
	|	type_in_state
	|	type_in_city
	|	brand_in_region
	|	brand_in_state
	|	brand_in_city
	|	model_in_region
	|	model_in_state
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
odsSpec : 'odhisha' | 'orissa' | 'odisa' | 'or';
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

bikeSpec : 'bike' | 'bikes' | 'motor cycles' | 'motorcycles' | 'motor cycle' | 'motorcycle' | '2 wheeler' | '2wheeler' | '2 wheelers' | '2whellers';

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
	: 'iphone1' | 'iphone2' | 'iphone3' | 'iphone4' | 'iphone5' | 'iphone6' | 'iphone7' | 'iphone8' | 'iphone9' | 'iphone10' | 'galaxy1' | 'galaxy2' | 'galaxy3' | 'galaxy4' | 'galaxy5' | 'galaxy6' | 'galaxy7' | 'galaxy8' | 'galaxy9' | 'galaxy10' | 'microg1' | 'microg2' | 'microg3' | 'microg4' | 'microg5' | 'microg6' | 'microg7' | 'microg8' | 'microg9' | 'microg10' | 'xiomx1' | 'xiomx2' | 'xiomx3' | 'xiomx4' | 'xiomx5' | 'xiomx6' | 'xiomx7' | 'xiomx8' | 'xiomx9' | 'xiomx10' | 'lumia1' | 'lumia2' | 'lumia3' | 'lumia4' | 'lumia5' | 'lumia6' | 'lumia7' | 'lumia8' | 'lumia9' | 'lumia10' | 'ipad1' | 'ipad2' | 'ipad3' | 'ipad4' | 'ipad5' | 'ipad6' | 'ipad7' | 'ipad8' | 'ipad9' | 'ipad10' | 'note1' | 'note2' | 'note3' | 'note4' | 'note5' | 'note6' | 'note7' | 'note8' | 'note9' | 'note10' | 'hptab1' | 'hptab2' | 'hptab3' | 'hptab4' | 'hptab5' | 'hptab6' | 'hptab7' | 'hptab8' | 'hptab9' | 'hptab10' | 'delta1' | 'delta2' | 'delta3' | 'delta4' | 'delta5' | 'delta6' | 'delta7' | 'delta8' | 'delta9' | 'delta10' | 'asusk1' | 'asusk2' | 'asusk3' | 'asusk4' | 'asusk5' | 'asusk6' | 'asusk7' | 'asusk8' | 'asusk9' | 'asusk10' | 'mac1' | 'mac2' | 'mac3' | 'mac4' | 'mac5' | 'mac6' | 'mac7' | 'mac8' | 'mac9' | 'mac10' | 'sglap1' | 'sglap1' | 'sglap1' | 'sglap4' | 'sglap5' | 'sglap6' | 'sglap7' | 'sglap8' | 'sglap9' | 'sglap10' | 'acer1' | 'acer2' | 'acer3' | 'acer4' | 'acer5' | 'acer6' | 'acer7' | 'acer8' | 'acer9' | 'acer10' | 'leno1' | 'leno2' | 'leno3' | 'leno4' | 'leno5' | 'leno6' | 'leno7' | 'leno8' | 'leno9' | 'leno10' | 'compq1' | 'compq2' | 'compq3' | 'compq4' | 'compq5' | 'compq6' | 'compq7' | 'compq8' | 'compq9' | 'compq10' | 'vanh1' | 'vanh2' | 'vanh3' | 'vanh4' | 'vanh5' | 'vanh6' | 'vanh7' | 'vanh8' | 'vanh9' | 'vanh10' | 'colorp1' | 'colorp2' | 'colorp3' | 'colorp4' | 'colorp5' | 'colorp6' | 'colorp7' | 'colorp8' | 'colorp9' | 'colorp10' | 'arrow1' | 'arrow2' | 'arrow3' | 'arrow4' | 'arrow5' | 'arrow6' | 'arrow7' | 'arrow8' | 'arrow9' | 'arrow10' | 'petere1' | 'petere2' | 'petere3' | 'petere4' | 'petere5' | 'petere6' | 'petere7' | 'petere8' | 'petere9' | 'petere10' | 'ralphp1' | 'ralphp2' | 'ralphp3' | 'ralphp4' | 'ralphp5' | 'ralphp6' | 'ralphp7' | 'ralphp8' | 'ralphp9' | 'ralphp10' | 'nike1' | 'nike2' | 'nike3' | 'nike4' | 'nike5' | 'nike6' | 'nike7' | 'nike8' | 'nike9' | 'nike10' | 'addidas1' | 'addidas2' | 'addidas3' | 'addidas4' | 'addidas5' | 'addidas6' | 'addidas7' | 'addidas8' | 'addidas9' | 'addidas10' | 'croc1' | 'croc2' | 'croc3' | 'croc4' | 'croc5' | 'croc6' | 'croc7' | 'croc8' | 'croc9' | 'croc10' | 'kings1' | 'kings2' | 'kings3' | 'kings4' | 'kings5' | 'kings6' | 'kings7' | 'kings8' | 'kings9' | 'kings10' | 'sfk1' | 'sfk2' | 'sfk3' | 'sfk4' | 'sfk5' | 'sfk6' | 'sfk7' | 'sfk8' | 'sfk9' | 'sfk10' | 'levis1' | 'levis2' | 'levis3' | 'levis4' | 'levis5' | 'levis6' | 'levis7' | 'levis8' | 'levis9' | 'levis10' | 'wrangl1' | 'wrangl2' | 'wrangl3' | 'wrangl4' | 'wrangl5' | 'wrangl6' | 'wrangl7' | 'wrangl8' | 'wrangl9' | 'wrangl10' | 'stryk1' | 'stryk2' | 'stryk3' | 'stryk4' | 'stryk5' | 'stryk6' | 'stryk7' | 'stryk8' | 'stryk9' | 'stryk10' | 'killer1' | 'killer2' | 'killer3' | 'killer4' | 'killer5' | 'killer6' | 'killer7' | 'killer8' | 'killer9' | 'killer10' | 'pepe1' | 'pepe2' | 'pepe3' | 'pepe4' | 'pepe5' | 'pepe6' | 'pepe7' | 'pepe8' | 'pepe9' | 'pepe10' | 'godrej1' | 'godrej2' | 'godrej3' | 'godrej4' | 'godrej5' | 'godrej6' | 'godrej7' | 'godrej8' | 'godrej9' | 'godrej10' | 'voltas1' | 'voltas2' | 'voltas3' | 'voltas4' | 'voltas5' | 'voltas6' | 'voltas7' | 'voltas8' | 'voltas9' | 'voltas10' | 'alwyn1' | 'alwyn2' | 'alwyn3' | 'alwyn4' | 'alwyn5' | 'alwyn6' | 'alwyn7' | 'alwyn8' | 'alwyn9' | 'alwyn10' | 'ge1' | 'ge2' | 'ge3' | 'ge4' | 'ge5' | 'ge6' | 'ge7' | 'ge8' | 'ge9' | 'ge10' | 'videocon1' | 'videocon2' | 'videocon3' | 'videocon4' | 'videocon5' | 'videocon6' | 'videocon7' | 'videocon8' | 'videocon9' | 'videocon10' | 'lgtv1' | 'lgtv2' | 'lgtv3' | 'lgtv4' | 'lgtv5' | 'lgtv6' | 'lgtv7' | 'lgtv8' | 'lgtv9' | 'lgtv10' | 'sgtv1' | 'sgtv2' | 'sgtv3' | 'sgtv4' | 'sgtv5' | 'sgtv6' | 'sgtv7' | 'sgtv8' | 'sgtv9' | 'sgtv10' | 'sony1' | 'sony2' | 'sony3' | 'sony4' | 'sony5' | 'sony6' | 'sony7' | 'sony8' | 'sony9' | 'sony10' | 'panasn1' | 'panasn2' | 'panasn3' | 'panasn4' | 'panasn5' | 'panasn6' | 'panasn7' | 'panasn8' | 'panasn9' | 'panasn10' | 'toshiba1' | 'toshiba2' | 'toshiba3' | 'toshiba4' | 'toshiba5' | 'toshiba6' | 'toshiba7' | 'toshiba8' | 'toshiba9' | 'toshiba10' | 'carrier1' | 'carrier2' | 'carrier3' | 'carrier4' | 'carrier5' | 'carrier6' | 'carrier7' | 'carrier8' | 'carrier9' | 'carrier10' | 'lyod1' | 'lyod2' | 'lyod3' | 'lyod4' | 'lyod5' | 'lyod6' | 'lyod7' | 'lyod8' | 'lyod9' | 'lyod10' | 'bluestar1' | 'bluestar2' | 'bluestar3' | 'bluestar4' | 'bluestar5' | 'bluestar6' | 'bluestar7' | 'bluestar8' | 'bluestar9' | 'bluestar10' | 'hitachi1' | 'hitachi2' | 'hitachi3' | 'hitachi4' | 'hitachi5' | 'hitachi6' | 'hitachi7' | 'hitachi8' | 'hitachi9' | 'hitachi10' | 'kenstar1' | 'kenstar2' | 'kenstar3' | 'kenstar4' | 'kenstar5' | 'kenstar6' | 'kenstar7' | 'kenstar8' | 'kenstar9' | 'kenstar10' | 'bajaj1' | 'bajaj2' | 'bajaj3' | 'bajaj4' | 'bajaj5' | 'bajaj6' | 'bajaj7' | 'bajaj8' | 'bajaj9' | 'bajaj10' | 'hero1' | 'hero2' | 'hero3' | 'hero4' | 'hero5' | 'hero6' | 'hero7' | 'hero8' | 'hero9' | 'hero10' | 'kawasaky' | 'kawasaky' | 'kawasaky' | 'kawasaky' | 'kawasaky' | 'kawasaky' | 'kawasaky' | 'kawasaky' | 'kawasaky' | 'kawasaky' | 'yamaha1' | 'yamaha2' | 'yamaha3' | 'yamaha4' | 'yamaha5' | 'yamaha6' | 'yamaha7' | 'yamaha8' | 'yamaha9' | 'yamaha10' | 'suzuki1' | 'suzuki2' | 'suzuki3' | 'suzuki4' | 'suzuki5' | 'suzuki6' | 'suzuki7' | 'suzuki8' | 'suzuki9' | 'suzuki10' | 'maruti1' | 'maruti2' | 'maruti3' | 'maruti4' | 'maruti5' | 'maruti6' | 'maruti7' | 'maruti8' | 'maruti9' | 'maruti10' | 'hyundai1' | 'hyundai2' | 'hyundai3' | 'hyundai4' | 'hyundai5' | 'hyundai6' | 'hyundai7' | 'hyundai8' | 'hyundai9' | 'hyundai10' | 'tata1' | 'tata2' | 'tata3' | 'tata4' | 'tata5' | 'tata6' | 'tata7' | 'tata8' | 'tata9' | 'tata10' | 'fiat1' | 'fiat2' | 'fiat3' | 'fiat4' | 'fiat5' | 'fiat6' | 'fiat7' | 'fiat8' | 'fiat9' | 'fiat10' | 'skoda1' | 'skoda2' | 'skoda3' | 'skoda4' | 'skoda5' | 'skoda6' | 'skoda7' | 'skoda8' | 'skoda9' | 'skoda10' | 'honda1' | 'honda2' | 'honda3' | 'honda4' | 'honda5' | 'honda6' | 'honda7' | 'honda8' | 'honda9' | 'honda10' | 'toyota1' | 'toyota2' | 'toyota3' | 'toyota4' | 'toyota5' | 'toyota6' | 'toyota7' | 'toyota8' | 'toyota9' | 'toyota10' | 'bmw1' | 'bmw2' | 'bmw3' | 'bmw4' | 'bmw5' | 'bmw6' | 'bmw7' | 'bmw8' | 'bmw9' | 'bmw10' | 'audi1' | 'audi2' | 'audi3' | 'audi4' | 'audi5' | 'audi6' | 'audi7' | 'audi8' | 'audi9' | 'audi10' | 'merc1' | 'merc2' | 'merc3' | 'merc4' | 'merc5' | 'merc6' | 'merc7' | 'merc8' | 'merc9' | 'merc10' 
	;

citySpec : STR;


ASSOC : 'in' | 'for' | 'sales for' | 'sales in';
WS : [' ' | '\t' | '\n' | '\r' | '\f']+ -> skip;
STR : [a-z]+;