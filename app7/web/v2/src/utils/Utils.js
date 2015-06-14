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
	g.append(t);
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