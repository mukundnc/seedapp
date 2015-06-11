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