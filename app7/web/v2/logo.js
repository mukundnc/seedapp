$(document).ready(function(){
	var logo = new Logo();
	logo.render();
})

function Logo(){
	this.H = 45;
	this.W = 205;
	this.lGap = 7;
	this.setViewport();
}

Logo.prototype.setViewport = function(){
	d3.select('svg').attr({height : this.H, width : this.W, style:"background-color : #4d5359"});
	var transform = 'translate(0, ' + this.H + ') scale(1, -1)';
	d3.select('.logo-container').attr('transform', transform);
}

Logo.prototype.render = function(){
	this.drawG();
	this.drawE1();
	this.drawE2();
	this.drawK();
	this.drawT();
	this.drawR();
	this.drawE3();
	this.drawE4();}

Logo.prototype.drawG = function(){
	var cx = 22;
	var cy = 22;
	var r = 20;

	var xS = cx + r;
	var yS = cy;
	var xE = cx;
	var yE = cy + r;

	var path = new Path();
	path.moveTo(cx, cy);
	path.lineTo(xS, yS);
	path.arc(r, r, 0, 1, 0, xE, yE);
	path.lineTo(xE+r/2, yE);

	var g = d3.select('.logo-container')
			  .append('g')
			  .append('path')
			  .attr({
			  	d : path.toString().replace('Z',''),
			  	class : 'c-g'
			  });
	
	this.gData = {
		xEnd : xS,
		yEnd : yE,
		cx : cx,
		cy : cy,
		r : r
	}
}

Logo.prototype.drawE1 = function(){
	var r = this.gData.r/2;
	var cx = this.gData.xEnd + this.lGap + r + 2;
	var cy = this.gData.cy/2 + 1;

	var xS = cx + r/2;
	var yS = cy - 5;
	var xE = cx + r/2
	var yE = cy + 5;
	var path = new Path();

	path.moveTo(xS, yS);
	path.arc(r, r, 0, 1, 0, xE, yE);
	path.lineTo(xE - 12, yE);

	var g = d3.select('.logo-container')
			  .append('g')
			  .append('path')
			  .attr({
			  	d : path.toString().replace('Z',''),
			  	class : 'c-e1'
			  });
	
	this.e1Data = {
		xEnd : xS,
		yEnd : yE,
		cx : cx,
		cy : cy,
		r : r
	}}

Logo.prototype.drawE2 = function(){
	var r = this.e1Data.r;
	var cx = this.e1Data.xEnd + this.lGap + r + 2;
	var cy = this.e1Data.cy;

	var xS = cx + r/2;
	var yS = cy - 5;
	var xE = cx + r/2
	var yE = cy + 5;
	var path = new Path();

	path.moveTo(xS, yS);
	path.arc(r, r, 0, 1, 0, xE, yE);
	path.lineTo(xE - 12, yE);

	var g = d3.select('.logo-container')
			  .append('g')
			  .append('path')
			  .attr({
			  	d : path.toString().replace('Z',''),
			  	class : 'c-e1'
			  });
	
	this.e2Data = {
		xEnd : xS,
		yEnd : yE,
		cx : cx,
		cy : cy,
		r : r
	}}

Logo.prototype.drawK = function(){
	var x1 = this.e2Data.xEnd + this.lGap;
	var y1 = 1;
	var x2 = x1;
	var y2 = this.gData.yEnd;
	var x3 = x1;
	var y3 = y2/4;
	var dx = 15;
	var dy = y3;
	var x4 = x3 + dx;
	var y4 = y3 + dy-2;
	var x5 = x3 + dx;
	var y5 = y3 - dy +2;

	var path = new Path();
	path.moveTo(x1, y1);
	path.lineTo(x2, y2);
	path.moveTo(x4, y4);
	path.lineTo(x3+2, y3);
	path.lineTo(x5, y5);

	var g = d3.select('.logo-container')
			  .append('g')
			  .append('path')
			  .attr({
			  	d : path.toString().replace('Z',''),
			  	class : 'c-k'
			  });
	
	this.kData = {
		xEnd : x4,
		yEnd : y2
	}	
}

Logo.prototype.drawT = function(){
	var x1 = this.kData.xEnd + this.lGap;
	var y1 = 1;
	var x2 = x1;
	var y2 = this.kData.yEnd;
	var x3 = x1;
	var y3 = 0.66 * y2;
	var dx = 10;
	var x4 = x1 + dx;
	var y4 = y3;
	var x5 = x3 - dx;
	var y5 = y3; 

	var path = new Path();
	path.moveTo(x1, y1);
	path.lineTo(x2, y2);
	path.moveTo(x4, y4);
	path.lineTo(x5, y5);

	var g = d3.select('.logo-container')
			  .append('g')
			  .append('path')
			  .attr({
			  	d : path.toString().replace('Z',''),
			  	class : 'c-t'
			  });
	
	this.tData = {
		xEnd : x4,
		yEnd : y2
	}	}

Logo.prototype.drawR = function(){
	var x1 = this.tData.xEnd + this.lGap -7;
	var y1 = 1;
	var x2 = x1;
	var y2 = this.e1Data.yEnd - 3;
	var r = 9;
	var x3 = x1 + 2*r;
	var y3 = y2;
	var path = new Path();
	
	path.moveTo(x1, y1);
	path.lineTo(x2, y2);
	path.arc(r, r, 0, 0, 0, x3, y3);
	
	var g = d3.select('.logo-container')
			  .append('g')
			  .append('path')
			  .attr({
			  	d : path.toString().replace('Z',''),
			  	class : 'c-r'
			  });
	
	this.rData = {
		xEnd : x3,
		yEnd : y2
	}		
}

Logo.prototype.drawE3 = function(){
	var r = this.gData.r/2;
	var cx = this.rData.xEnd + this.lGap + r + 2;
	var cy = this.gData.cy/2 + 1;

	var xS = cx + r/2;
	var yS = cy - 5;
	var xE = cx + r/2
	var yE = cy + 5;
	var path = new Path();

	path.moveTo(xS, yS);
	path.arc(r, r, 0, 1, 0, xE, yE);
	path.lineTo(xE - 12, yE);

	var g = d3.select('.logo-container')
			  .append('g')
			  .append('path')
			  .attr({
			  	d : path.toString().replace('Z',''),
			  	class : 'c-e1'
			  });
	
	this.e3Data = {
		xEnd : xS,
		yEnd : yE,
		cx : cx,
		cy : cy,
		r : r
	}}

Logo.prototype.drawE4 = function(){
	var r = this.e3Data.r;
	var cx = this.e3Data.xEnd + this.lGap + r + 2;
	var cy = this.e3Data.cy;

	var xS = cx + r/2;
	var yS = cy - 5;
	var xE = cx + r/2
	var yE = cy + 5;
	var path = new Path();

	path.moveTo(xS, yS);
	path.arc(r, r, 0, 1, 0, xE, yE);
	path.lineTo(xE - 12, yE);

	var g = d3.select('.logo-container')
			  .append('g')
			  .append('path')
			  .attr({
			  	d : path.toString().replace('Z',''),
			  	class : 'c-e1'
			  });
	
	this.e2Data = {
		xEnd : xS,
		yEnd : yE,
		cx : cx,
		cy : cy,
		r : r
	}}
