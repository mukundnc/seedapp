grammar sales;

query : display_aspect? container_in_container;

display_apspect : 'show' 'all' | 'list' 'all' | 'get' 'all';

container_in_container 
	:	category_in_region
	|	category_in_state
	|	type_in_region
	|	type_in_state
	|	brand_in_region
	|	brand_in_state
	;

category_in_region 
	: categorySpec ASSOC regionSpec
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
applianceSpec  :  'applicance' | 'applicances';

regionSpec 
	: eastSpec
	| westSpec
	| northSpec
	| southSpec
	;

eastSpec : 'east' | 'eastern';
westSpec : 'west' | 'western';
northSpec : 'north' | 'northern';
southSpe : 'south' | 'southern';

ASSOC : 'in' | 'for' ;