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
	g.attr('transform', xForm.replace('-1', '1')).attr('id', 'arc');

	var salesData=[
		{label:"Basic", color:"#3366CC"},
		{label:"Plus", color:"#DC3912"},
		{label:"Lite", color:"#FF9900"},
		{label:"Elite", color:"#109618"},
		{label:"Delux", color:"#990099"}
	];
	function randomData(){
		return salesData.map(function(d){ 
			return {label:d.label, value:1000*Math.random(), color:d.color};});
	}
	Donut3D.draw("arc", randomData(), 150, 150, 130, 100, 30, 0.4);
}

var Donut3D={};

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

function pieOuter(d, rx, ry, h ){
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

function pieInner(d, rx, ry, h, ir ){
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

function getPercent(d){
	return (d.endAngle-d.startAngle > 0.2 ? 
			Math.round(1000*(d.endAngle-d.startAngle)/(Math.PI*2))/10+'%' : '');
}	
	
Donut3D.draw=function(id, data, x /*center x*/, y/*center y*/, 
		rx/*radius x*/, ry/*radius y*/, h/*height*/, ir/*inner radius*/){

	var _data = d3.layout.pie().sort(null).value(function(d) {return d.value;})(data);
	
	var slices = d3.select("#"+id).append("g").attr("transform", "translate(" + x + "," + y + ")")
		.attr("class", "slices");
		
	slices.selectAll(".innerSlice").data(_data).enter().append("path").attr("class", "innerSlice")
		.style("fill", function(d) { return d3.hsl(d.data.color).darker(0.7); })
		.attr("d",function(d){ return pieInner(d, rx+0.5,ry+0.5, h, ir);})
		.each(function(d){this._current=d;});
	
	slices.selectAll(".topSlice").data(_data).enter().append("path").attr("class", "topSlice")
		.style("fill", function(d) { return d.data.color; })
		.style("stroke", function(d) { return d.data.color; })
		.attr("d",function(d){ return pieTop(d, rx, ry, ir);})
		.each(function(d){this._current=d;});
	
	slices.selectAll(".outerSlice").data(_data).enter().append("path").attr("class", "outerSlice")
		.style("fill", function(d) { return d3.hsl(d.data.color).darker(0.7); })
		.attr("d",function(d){ return pieOuter(d, rx-.5,ry-.5, h);})
		.each(function(d){this._current=d;});

	slices.selectAll(".percent").data(_data).enter().append("text").attr("class", "percent")
		.attr("x",function(d){ return 0.6*rx*Math.cos(0.5*(d.startAngle+d.endAngle));})
		.attr("y",function(d){ return 0.6*ry*Math.sin(0.5*(d.startAngle+d.endAngle));})
		.text(getPercent).each(function(d){this._current=d;});				
}
	