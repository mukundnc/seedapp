function SearchContainerView(model, options){
	this.model = model;
	this.options = options;
	this.utils = new SvgUtils();
}

SearchContainerView.prototype.render = function(){
	var xForm = this.utils.getCodtSystemXForm(this.options.xOrg, this.options.yOrg);
	var g = this.utils.getGroupByClassName('sp-group');
	g.attr('transform', xForm.replace('-1', '1')).attr('id', 'arc');
	g.html('');

	var colors=["#3366CC", "#DC3912", "#FF9900", "#109618", "#990099", "#2b908f"];
	var data = [];

	this.model.sectors.top.forEach(function(t){
		data.push({
			label : t.key,
			value : t.count,
			color : colors.pop()
		});
	});
	if(this.model.sectors.othersCount > 0){
		data.push({
			label : "Others",
			value : this.model.sectors.othersCount,
			color : colors.pop()
		});
	}
	this.drawPie("arc", data, this.options.w/2, -this.options.h/2, 150, 120, 30, 0.4);

	var self = this;
	$('.innerSlice, .topSlice, .outerSlice, .sp-pie-label').on('click', function(e){
		self.options.controller.executeSearch({
			qid : self.options.qid,
			source : 'container',
			label : d3.select(this).attr('id')
		});
	});
}

SearchContainerView.prototype.drawPie = function(id, data, x, y, rx, ry, h, ir){
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

SearchContainerView.prototype.pieTop = function (d, rx, ry, ir ){
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

SearchContainerView.prototype.pieOuter = function (d, rx, ry, h ){
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

SearchContainerView.prototype.pieInner = function (d, rx, ry, h, ir ){
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

SearchContainerView.prototype.getLabel = function (d){
	return d.data.label;

	return (d.endAngle-d.startAngle > 0.2 ? 
			Math.round(1000*(d.endAngle-d.startAngle)/(Math.PI*2))/10+'%' : '');
}	

