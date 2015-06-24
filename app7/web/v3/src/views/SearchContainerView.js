function SearchContainerView(model, options){
	this.model = model;
	this.options = options;
	this.utils = new SvgUtils();
}

SearchContainerView.prototype.render = function(){
	console.log(this.model);
	console.log(this.options);

	var xForm = this.utils.getCodtSystemXForm(this.options.xOrg, this.options.yOrg);
	var g = this.utils.getGroupByClassName('sp-group');
	g.attr('transform', xForm);

	this.utils.addLine(g, 10 , 0, 10, this.options.h, 'chart-axis');

	var d = {
		startAngle : Math.PI/15,
		endAngle : Math.PI/3
	}

	var rx = 10, ry = 30;
	var ir = 5;
	var p = pieTop(d, rx, ry, ir);
	g.append('path').attr('d', p).attr('fill', 'red');
}

function pieTop(d, rx, ry, ir ){
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