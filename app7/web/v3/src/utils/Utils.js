var pSpace = ' ';
function Path(){
	this.path = '';
}

Path.prototype.moveTo = function(x, y){
	this.path += ( pSpace + 'M' + pSpace + x + pSpace + y);
}

Path.prototype.lineTo = function(x, y){
	this.path += ( pSpace + 'L' + pSpace + x + pSpace + y);
}

Path.prototype.arc = function(rx, ry, xRot, laf, sf, x, y){
	this.path += ( pSpace + 'A' + pSpace + rx + pSpace + ry + pSpace + xRot + pSpace + laf + pSpace + sf + pSpace + x + pSpace + y);
}

Path.prototype.toString = function(){
	this.path += pSpace + 'Z'
	return this.path;
}

Path.prototype.getPathForSectorArcAroundCenter = function(xC, yC, rI, rO, thetaS, thetaE){
	var x1 = xC + rI * Math.cos(thetaS);
	var y1 = yC + rI * Math.sin(thetaS);

	var x2 = xC + rO * Math.cos(thetaS);
	var y2 = yC + rO * Math.sin(thetaS);

	var x3 = xC + rO * Math.cos(thetaE);
	var y3 = yC + rO * Math.sin(thetaE);

	var x4 = xC + rI * Math.cos(thetaE);	
	var y4 = yC + rI * Math.sin(thetaE);

	var xCodts = [x1, x2, x3, x4];
	var yCodts = [y1, y2, y3, y4];

	var xMin = d3.min(xCodts, function(d) { return d;});
	var xMax = d3.max(xCodts, function(d) { return d;});
	var yMin = d3.min(yCodts, function(d) { return d;});
	var yMax = d3.max(yCodts, function(d) { return d;});

	var path = new Path();
	path.moveTo(x3, y3);
	path.arc(rO, rO, 0, 0, 0, x2, y2);
	path.lineTo(x1, y1);
	path.arc(rI, rI, 0, 0, 1, x4, y4);

	return {
		path : path,
		centroid : {
			x : (xMax + xMin)/2,
			y : (yMax + yMin)/2
		}
	}
}

function strReplaceAll(find, replace, str) {
 	return str.replace(new RegExp(find, 'g'), replace);
}
function strToFirstUpper(str){
	return str.replace(str[0], str[0].toUpperCase());
}

function SvgUtils(){

}

SvgUtils.prototype.addText = function(g, x, y, text, cssText, textAlign){
	var t = g.append('text')
			 .attr({
			 	x : x,
			 	y : y,
			 	class : cssText || 'col-text',
			 	'text-anchor' : textAlign || 'middle'
			 })
			 .text(text);
	return t;	
}

SvgUtils.prototype.addTextXForm = function(g, x, y, text, cssText, textAlign){
	var gX = g.append('g').attr('transform', 'scale(1, -1)');
	var t = this.addText(gX, x, y, text, cssText, textAlign);
	return gX;
}

SvgUtils.prototype.addLine = function(g, x1, y1, x2, y2, cssLine){
	var l = g.append('line')
	 		 .attr({
	 			x1 : x1,
	 			y1 : y1,
	 			x2 : x2,
	 			y2 : y2,
	 			class : cssLine
	 		});
	return l;
}

SvgUtils.prototype.addRectLabel = function(g, x, y, w, h, text, cssGroup, cssRect, cssText, textAlign){
	var gLabel = g.append('g').attr('class', cssGroup);
	var r = gLabel.append('rect')
			 .attr({
			 	x : x,
			 	y : y,
			 	height : h,
			 	width : w,
			 	class : cssRect
			 });
			 this.addTextXForm(gLabel, x+w/6, -(y+h/2-3), text, cssText, textAlign);
	return gLabel;
}

SvgUtils.prototype.addRect = function(g, x, y, w, h, cssRect){
	var r = g.append('rect')
	         .attr({
	         	x : x,
	         	y : y,
	         	height : h,
	         	width : w,
	         	class : cssRect
	         });
	return r
}

SvgUtils.prototype.getCodtSystemXForm = function(xOrg, yOrg){
	return 'translate(' + xOrg +' ,'  + yOrg + ') scale(1, -1)';
}

SvgUtils.prototype.getGroupByClassName = function(clsName){
	var g = d3.select('.svg-container').select('.svg-view').select('.' + clsName);
	if(g.empty()){
		g = d3.select('.svg-container')
	          .select('.svg-view')
	          .append('g')
		      .attr('class', clsName);
	}
	return g;
}

SvgUtils.prototype.drawPie = function(id, data, x, y, rx, ry, h, ir){
	var self = this;
	var _data = d3.layout.pie().sort(null).value(function(d) {return d.value;})(data);
	
	var slices = d3.select("#"+id).append("g").attr("transform", "translate(" + x + "," + y + ")")
		.attr("class", "slices");
		
	slices.selectAll(".innerSlice").data(_data).enter().append("path").attr("class", "innerSlice")
		.style("fill", function(d) { return d3.hsl(d.data.color).darker(0.7); })
		.attr("d",function(d){ return self.pieInner(d, rx+0.5,ry+0.5, h, ir);})
		.attr('id', function(d) { return d.data.label; })
		.each(function(d){this._current=d;});
	
	slices.selectAll(".topSlice").data(_data).enter().append("path").attr("class", "topSlice")
		.style("fill", function(d) { return d.data.color; })
		.style("stroke", function(d) { return d.data.color; })
		.attr("d",function(d){ return self.pieTop(d, rx, ry, ir);})
		.attr('id', function(d) { return d.data.label; })
		.each(function(d){this._current=d;});
	
	slices.selectAll(".outerSlice").data(_data).enter().append("path").attr("class", "outerSlice")
		.style("fill", function(d) { return d3.hsl(d.data.color).darker(0.7); })
		.attr("d",function(d){ return self.pieOuter(d, rx-.5,ry-.5, h);})
		.attr('id', function(d) { return d.data.label; })
		.each(function(d){this._current=d;});

	slices.selectAll(".sp-pie-label").data(_data).enter().append("text").attr("class", "sp-pie-label")
		.attr("x",function(d){ return 0.6*rx*Math.cos(0.5*(d.startAngle+d.endAngle));})
		.attr("y",function(d){ return 0.6*ry*Math.sin(0.5*(d.startAngle+d.endAngle));})
		.attr('id', function(d) { return d.data.label; })
		.text(self.getLabel).each(function(d){this._current=d;});		
}

SvgUtils.prototype.pieTop = function (d, rx, ry, ir ){
	if(d.endAngle - d.startAngle == 0 ) return "M 0 0";
	var sx = rx*Math.cos(d.startAngle),
		sy = ry*Math.sin(d.startAngle),
		ex = rx*Math.cos(d.endAngle),
		ey = ry*Math.sin(d.endAngle);
		
	var ret =[];
	ret.push("M",sx,sy,"A",rx,ry,"0",(d.endAngle-d.startAngle > Math.PI? 1: 0),"1",ex,ey,"L",ir*ex,ir*ey);
	ret.push("A",ir*rx,ir*ry,"0",(d.endAngle-d.startAngle > Math.PI? 1: 0), "0",ir*sx,ir*sy,"z");
	return ret.join(" ");
}

SvgUtils.prototype.pieOuter = function (d, rx, ry, h ){
	var startAngle = (d.startAngle > Math.PI ? Math.PI : d.startAngle);
	var endAngle = (d.endAngle > Math.PI ? Math.PI : d.endAngle);
	
	var sx = rx*Math.cos(startAngle),
		sy = ry*Math.sin(startAngle),
		ex = rx*Math.cos(endAngle),
		ey = ry*Math.sin(endAngle);
		
		var ret =[];
		ret.push("M",sx,h+sy,"A",rx,ry,"0 0 1",ex,h+ey,"L",ex,ey,"A",rx,ry,"0 0 0",sx,sy,"z");
		return ret.join(" ");
}

SvgUtils.prototype.pieInner = function (d, rx, ry, h, ir ){
	var startAngle = (d.startAngle < Math.PI ? Math.PI : d.startAngle);
	var endAngle = (d.endAngle < Math.PI ? Math.PI : d.endAngle);
	
	var sx = ir*rx*Math.cos(startAngle),
		sy = ir*ry*Math.sin(startAngle),
		ex = ir*rx*Math.cos(endAngle),
		ey = ir*ry*Math.sin(endAngle);

		var ret =[];
		ret.push("M",sx, sy,"A",ir*rx,ir*ry,"0 0 1",ex,ey, "L",ex,h+ey,"A",ir*rx, ir*ry,"0 0 0",sx,h+sy,"z");
		return ret.join(" ");
}

SvgUtils.prototype.getLabel = function (d){
	return d.data.label;

}	

SvgUtils.prototype.getDefaultColors = function(){
	return ["#3366CC", "#DC3912", "#FF9900", "#109618", "#990099", "#2b908f"];
}