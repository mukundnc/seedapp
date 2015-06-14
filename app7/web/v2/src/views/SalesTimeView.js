function SalesTimeView(){
}

SalesTimeView.prototype.clear = function(){
	d3.select('.svg-container').select('.svg-view').html('');
}

SalesTimeView.prototype.render = function(catSalesInTime, options){
	this.options = options;
	var yBlockWd = catSalesInTime.meta.yearBlockWidth;
	var svg = d3.select('.svg-container').select('.svg-view');

	var g = svg.append('g')
		       .attr('transform', 'translate(' + options.frmStartX + ',' + options.frmStartY + ') scale(1, -1)')
		       .attr('class', 'cat-time');
    var xEnd = 0;
    var allHeights = [];	       
    Object.keys(catSalesInTime.data).forEach((function(yKey){

    	var catSaleInYear = catSalesInTime.data[yKey];

    	Object.keys(catSaleInYear).forEach((function(cKey){

    		 var c = catSaleInYear[cKey];

			 var r = this.addRect(g, c.x, c.y, c.W, 0, cKey).attr('class', 's-cat');      //category rect

			 allHeights.push(c.H);

			 xEnd = c.x + c.W;

    	}).bind(this));

    	this.addLine(g, xEnd, 0, xEnd, -6);                                                // x axis ticks

    	this.addText(g, (xEnd-yBlockWd/2), 15, yKey);                                      // year labels

    }).bind(this));

    this.addLine(g, 0, 0, xEnd, 0);                                                        // x axis
    this.addLine(g, 0, 0, 0, options.frmHeight);                                           // y axis
    this.addYAxisLabels(g, xEnd, options.frmHeight, catSalesInTime.meta.yScale);           // y axis labels
    this.addCategoryMarkers(g, options.frmStartX, catSalesInTime);                         // category markers
    this.addEventHandlers();
    this.addViewOptions(g, xEnd, options.frmHeight);
    this.animateCategoryHeights(g, allHeights);
}

SalesTimeView.prototype.animateCategoryHeights = function(g, heights){
	g.selectAll('rect')
	 .data(heights)
	 .transition()
	 .attr('height', function(h) { return h; })
}
SalesTimeView.prototype.getFillStyleForCategory = function(category){
	var style = '';
	switch(category){
		case 'Automobile' : style = 'stroke-width : 1px; stroke : white; fill: #2b908f'; break;
		case 'Electronics' : style = 'stroke-width : 1px; stroke : white; fill: #90ee7e'; break;
		case 'Applicance' : style = 'stroke-width : 1px; stroke : white; fill: #f45b5b'; break;
		case 'Clothing' : style = 'stroke-width : 1px; stroke : white; fill: #7798BF'; break;
		case 'East' : style = 'stroke-width : 1px; stroke : white; fill: #2b908f'; break;
		case 'West' : style = 'stroke-width : 1px; stroke : white; fill: #90ee7e'; break;
		case 'North' : style = 'stroke-width : 1px; stroke : white; fill: #f45b5b'; break;
		case 'South' : style = 'stroke-width : 1px; stroke : white; fill: #7798BF'; break;	}
	return style;
}
SalesTimeView.prototype.addRect = function(g, x, y, w, h, category){
	return g.append('rect')
	 .attr({
	 	x : x,
	 	y : y,
	 	width : w,
	 	height : h,
	 	style : this.getFillStyleForCategory(category)
	 });
}
SalesTimeView.prototype.addLine = function(g, px1, py1, px2, py2, s){
	g.append('line')
	 .attr({
		x1 : px1 || 0,
		y1 : py1 || 0,
		x2 : px2 || 0,
		y2 : py2 || 0,
		style : s || 'stroke-width : 1px; stroke : grey;'
	});
}

SalesTimeView.prototype.addText = function(g, x, y, label, textAnchor){
	return g.append('g')
	 .attr('transform', 'scale(1,-1)')
	 .append('text')
	 .attr({
	 	x : x || 0,
	 	y : y || 0,
	 	'text-anchor' : textAnchor | 'middle',
	 	style: 'color:grey;cursor:default;font-size:11px;fill:grey;'
	 })
	 .text(label);
}

SalesTimeView.prototype.addYAxisLabels = function(g, w, h, yScale){
	this.addLine(g, 0, h/4, w, h/4);
	this.addLine(g, 0, h/2, w, h/2);
	this.addLine(g, 0, 3*h/4, w, 3*h/4);
	this.addLine(g, 0, h, w, h);

	var max = yScale.domain()[1];
	this.addText(g, -35, -h/4, Math.round(max/4), null, 'end');
	this.addText(g, -35, -h/2, Math.round(max/2), null, 'end');
	this.addText(g, -35, -3*h/4, Math.round(3*max/4), null, 'end');
	this.addText(g, -35, -h, Math.round(max), null, 'end');

	var y = (-h/2.5);
	g.append('text')
	 .attr('transform', 'scale(1,-1) rotate(-180, -50, ' + y + ')')
	 .attr({
	 	x : -50,
	 	y : y,
	 	style : 'writing-mode: tb; glyph-orientation-vertical: 90;color:grey;cursor:default;font-size:15px;fill:grey;'
	 })
	 .text('SALES');
}

SalesTimeView.prototype.addCategoryMarkers = function(g, xStart, catSalesInTime){
	var arr = Object.keys(catSalesInTime.data[2000]); 
	var x = xStart + 200;
	var y = -40;
	arr.forEach((function(c){
		this.addRect(g, x, y, 10, 10, c);
		this.addText(g, x+15, -y, c)
		x+=80;
	}).bind(this));
}

SalesTimeView.prototype.addEventHandlers = function(g){
	var self = this;
	$('.s-cat').on('click', function(e) {
		var rect = d3.select(this);
		self.handleCategorySelectClick({
			x : parseFloat(rect.attr('x')),
			y : parseFloat(rect.attr('y')),
			h : parseFloat(rect.attr('height')),
			w : parseFloat(rect.attr('width'))
		})
	});
	$('.svg-view').on('mousedown', function(e){
		$('.cat-filter-group').remove();
	});
}

SalesTimeView.prototype.handleCategorySelectClick = function(params){
	var xC = params.x + params.w/2 ;
	var yC = 0.75 * (params.h + params.y) ;
	var rI = 40, rO = 70;
	var thetaS = 15 * (Math.PI/180);
	var thetaE = 60 * (Math.PI/180);
	var g = d3.select('g')
	          .classed('cat-time', true)
	          .append('g')
	          .attr('class', 'cat-filter-group');
	var filterData = {
		types:{
			name : 'Types',
			className : 'cat-filter',
			id : 'catFilterTypes'
		},
		brands:{
			name : 'Brands',
			className : 'cat-filter',
			id : 'catFilterBrands'
		},
		states:{
			name : 'State',
			className : 'cat-filter',
			id : 'catFilterStates'
		}
	}
	for(var key in filterData){
		var arcPath = new Path().getPathForSectorArcAroundCenter(xC, yC, rI, rO, thetaS, thetaE);	  				    
	    var txt = this.addText(g, arcPath.centroid.x-15, -(arcPath.centroid.y-5), filterData[key].name, 'end');
	    var lStyle = 'color:grey;cursor:default;font-size:11px;fill:white;';
	    txt.attr('style', lStyle);	
	    g.append('path')
	     .attr({
	   	   d : arcPath.path.toString(),
	   	   class : filterData[key].className,
	   	   id : filterData[key].id,
	  	   style : 'stroke:white; stroke-width: 1px; fill-opacity:0.4; fill:white'
	    });	

		thetaS = thetaE + 5 * (Math.PI/180);
		thetaE = thetaS + 45 * (Math.PI/180);
	}

	var self = this;
	$('.cat-filter').on('click', function(e){
		self.handleCategoryFilterClick(e, this)
	});
}

SalesTimeView.prototype.handleCategoryFilterClick = function(e, selFilterElem){
	d3.select(selFilterElem.parentNode).remove();
}

SalesTimeView.prototype.addViewOptions = function(g, xStart, yMax){
	var x = xStart + 30;
	var y = 50;
	var h = 25, w = 50;
	var sCat = 'stroke-width : 1px; stroke : grey;fill:#4d90fe';
	var sRgn = 'stroke-width : 1px; stroke : grey;fill:#4d90fe';
	if(this.options.viewType === 'category')
		sCat = 'stroke-width : 1px; stroke : grey; fill:rgba(52, 52, 62, 1)';
	else
		sRgn = 'stroke-width : 1px; stroke : grey; fill:rgba(52, 52, 62, 1)';

	g.append('rect')
	 .attr({
	 	x : x,
		y : y,
		height : h,
		width : w,
		style : sCat,
		class : 'view-opt'
	 });
	g.append('rect')
	 .attr({
	 	x : x,
		y : y+h,
		height : h,
		width : w,
		style : sRgn,
		class : 'view-opt'
	 });
	 var cat = this.addText(g, x, -(y + 1.5 * h - 5), 'Categories');
	 var rgn = this.addText(g, x+5, -(y + 0.5 * h - 5), 'Regions');

	 if(this.options.viewType === 'category')
	 	cat.attr('style', 'color:grey;cursor:default;font-size:11px;fill:white;');
	 else	 	
	 	rgn.attr('style', 'color:grey;cursor:default;font-size:11px;fill:white;');
	
	 cat.attr('class', 'view-opt-txt');
	 rgn.attr('class', 'view-opt-txt');
	 var self = this;
	 $('.view-opt').on('click', function(e){
	 	$('.view-opt').attr('style', 'stroke-width : 1px; stroke : grey; fill:rgba(52, 52, 62, 1)');
	 	$('.view-opt-txt').attr('style', 'color:grey;cursor:default;font-size:11px;fill:grey;');

	 	var y = $(this).attr('y');
	 	$(this).attr('style', 'stroke-width : 1px; stroke : grey;fill:#4d90fe');

	 	var active = '';
	 	if(parseInt(y) > 50){
	 		cat.attr('style', 'color:grey;cursor:default;font-size:11px;fill:white;');
	 		active = 'category';
	 	}
	 	else{
	 		rgn.attr('style', 'color:grey;cursor:default;font-size:11px;fill:white;');
	 		active = 'region';
	 	}
	 	self.options.controller.activeViewChange(active);
	 });
}








