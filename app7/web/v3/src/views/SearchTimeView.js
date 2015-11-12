function SearchTimeView(model, options){
	this.model = model;
	this.options = options;
	this.utils = new SvgUtils();
	this.groups = {
		axes : 'st-axis',
		times : 'st-time',
		backnext : 'st-backnext'
	}
	this.currTimeModelIndex = 0;
	$(document).on('click', function(e){
		if(false === $(e.target).hasClass('opt-menu-img'))
			$('.opt-menu-container').hide();
	});
}

SearchTimeView.prototype.clear = function(){
	this.getGroupById(this.groups.axes).html('');
	this.getGroupById(this.groups.times).html('');
	this.getGroupById(this.groups.backnext).html('');
}

SearchTimeView.prototype.render = function(type){
	this.clear();
	this.gtype = type;
	var g = this.getGroupById(this.groups.axes);
	if(this.gtype === 'stacked')
		this.getStackConstants();
	this.addAxes();
	this.showTimeView();
	this.initOptionsMenu();
}

SearchTimeView.prototype.getStackConstants = function(){
	if(this.gtype !== 'stacked')
		return;
	this.stackbw = (this.model.axes.x.labels[0].xEnd / 3);
	this.stackiw = (this.model.axes.x.labels[0].xEnd / 2)-(this.stackbw / 2);
	this.stackxw = this.model.axes.x.labels[0].xEnd;
	var timeGroup = this.model.timeGroups[this.currTimeModelIndex];
	var maxY = 0;
	for(var key in timeGroup){
		var bars = timeGroup[key];
		var yEnd=0;
		bars.forEach(function(bar){
			yEnd += bar.count;
		});
		if(maxY < yEnd)
			maxY = yEnd;
	}
	var pmaxY = this.model.axes.y.labels[this.model.axes.y.labels.length-1].label;
	this.coEff = pmaxY/maxY;
	var i=1;
	for(var key in this.model.axes.y.labels){
		var x = this.model.axes.y.labels[key];
		x.slabel = parseInt((maxY/this.model.axes.y.labels.length) * i, 10);
		i++;
	}
}

SearchTimeView.prototype.getGroupById = function(clsName){
	var g = d3.select('.svg-container').select('.svg-view').select('.' + clsName);
	if(g.empty()){
		g = d3.select('.svg-container')
	          .select('.svg-view')
	          .append('g')
		      .attr('transform', 'translate(' + this.options.xOrg + ',' + this.options.yOrg + ') scale(1, -1)')
		      .attr('class', clsName);
	}
	return g;
}

SearchTimeView.prototype.addAxes = function(){
	this.addXAxis();
	this.addYAxis();
}

SearchTimeView.prototype.addXAxis = function(){
	var g = this.getGroupById(this.groups.axes);
	var xAxis = this.model.axes.x;
	this.utils.addLine(g, xAxis.xStart, 0, xAxis.xEnd, 0, 'chart-axis');
	xAxis.labels.forEach((function(l){
		this.utils.addTextXForm(g, (l.xStart + l.xEnd)/2, 15, l.label, 'st-text', 'middle');
		this.utils.addLine(g, l.xEnd, 0, l.xEnd, -6, 'chart-axis');
	}).bind(this));
}

SearchTimeView.prototype.addYAxis = function(){
	var g = this.getGroupById(this.groups.axes);
	var yAxis = this.model.axes.y;
	var h = 0;
	this.utils.addLine(g, yAxis.xStart, yAxis.yStart, yAxis.xEnd, yAxis.yEnd, 'chart-axis');
	yAxis.labels.forEach((function(l){
		if(this.gtype === 'stacked')
			this.utils.addTextXForm(g, l.xStart - 10, -l.yStart, l.slabel, 'st-text', 'end');
		else
			this.utils.addTextXForm(g, l.xStart - 10, -l.yStart, l.label, 'st-text', 'end');
		this.utils.addLine(g, l.xStart, l.yStart, l.xEnd, l.yEnd, 'chart-axis');
		h = l.yEnd;
	}).bind(this));
	var y = -h/2
	var x = -55;
	var gT = this.utils.addTextXForm(g, x, y, 'SALES', 'col-text', 'middle');
	gT.attr('transform', 'scale(1, -1) rotate(-90, ' + x + ',' + y + ')' );	
}

SearchTimeView.prototype.showTimeView = function(){
	var g = this.getGroupById(this.groups.times);
	g.html('');
	this.showBackNextControls();
	this.showTimeGroupView();
}

SearchTimeView.prototype.showBackNextControls = function(){
	var g = this.getGroupById(this.groups.backnext);
	g.html('');

	var timeGroups = this.model.timeGroups;
	if(timeGroups.length < 2) return;

	var xS = this.options.w - 250;
	var yS = this.options.h - 150;
	var rH = 25;
	var rW = 25;
	var gR = null;
	var labels = ['<', '>'];
	var id = 'stBack';
	labels.forEach((function(label){
		gR = this.utils.addRectLabel(g, xS, yS, rW, rH, label, 'st-bn', 'st-bn-rect', 'st-bn-text', 'start');
		gR.attr('id', id);
		id = 'stNext';
		xS += rW;
	}).bind(this));
	gR.select('rect').classed('st-bn-select', true);
	gR.select('text').classed('st-bn-text-select', true);
	var self = this;
	$('.st-bn').on('click', function(e){
		self.onTimeGroupBackNext(this);
	});

}

SearchTimeView.prototype.onTimeGroupBackNext = function(selBackNext){
	d3.selectAll('.st-bn-select').classed('st-bn-select', false).classed('st-bn-rect', true);
	d3.selectAll('.st-bn-text-select').classed('st-bn-text-select', false).classed('st-bn-text', true);
	d3.select(selBackNext).select('rect').attr('class', 'st-bn-select');
	d3.select(selBackNext).select('text').attr('class', 'st-bn-text-select');
	var id = d3.select(selBackNext).attr('id');
	var timeGroups = this.model.timeGroups;
	if(id === 'stBack'){
		this.currTimeModelIndex--;
		if(this.currTimeModelIndex < 0){
			this.currTimeModelIndex = 0;
			return;
		}
	}
	else{
		this.currTimeModelIndex++;		
		if(this.currTimeModelIndex >= timeGroups.length){
			this.currTimeModelIndex = timeGroups.length-1;
			return;
		}
	}
	this.showTimeGroupView();
}

SearchTimeView.prototype.showTimeGroupView = function(){
	// alert(this.gtype);
	var g = this.getGroupById(this.groups.times);
	g.html('');

	var timeGroup = this.model.timeGroups[this.currTimeModelIndex];
	var allHeights = [];
	var swidth = (this.gtype === 'stacked') ? this.stackiw : 0;		

	for(var key in timeGroup){
		var bars = timeGroup[key];
		var i = 1;
		var sheight = 0;
		bars.forEach((function(bar){
			if(bar.h > 0){
				var gR;
				if(this.gtype === 'stacked'){
					gR = this.utils.addRect(g, swidth, (bar.y+sheight)*this.coEff, this.stackbw, 0, 'bar-' + i + ' bh');
					sheight+=bar.h;
					allHeights.push(bar.h*this.coEff);
				}
				else{
					gR = this.utils.addRect(g, bar.x, bar.y, bar.w, 0, 'bar-' + i + ' bh');	
					allHeights.push(bar.h);								
				}
				gR.attr({label : bar.label, tKey : bar.tKey});
				
			}
			i++;
		}).bind(this));
		if(this.gtype === 'stacked')
			swidth += this.stackxw;
	}
	this.addTimeGroupContentMarkers(g);
	this.animateCategoryHeights(g, allHeights);
	setTimeout(function(){
		self.showOutliersForCurrentTimeGroup()
	},  200);	
	var self = this;
	$('.bh').on('click', function(e){
		var t = d3.select(this).attr('tKey');
		if(t.length > 2){
			self.options.controller.executeSearch({
				qid : self.options.qid,
				source : 'timeline',
				label : d3.select(this).attr('label'),
				tKey : t,
				type : self.model.type
			})	
		}	
	});

}

SearchTimeView.prototype.animateCategoryHeights = function(g, heights){
	g.selectAll('.bh')
	 .data(heights)
	 .transition()
	 .attr('height', function(h) { return h; })
}

SearchTimeView.prototype.addTimeGroupContentMarkers = function(g){
	var timeGroup = this.model.timeGroups[this.currTimeModelIndex];
	var key = Object.keys(timeGroup)[0];
	var labels = [];
	timeGroup[key].forEach(function(l){
		labels.push(l.label);
	});

	var maxStrLen = d3.max(labels, function(s) { return s.length; });
	var d1 = 40;
	var d2 = d1 + 40;
	if(maxStrLen > 10){
		d2 += 30;
		d1 += 20;
	}

	var x = this.model.axes.x.xEnd/4;
	var y = -40;
	var i = 1;
	labels.forEach((function(c){
		this.utils.addRect(g, x, y, 10, 10, 'bar-'+i);
		this.utils.addTextXForm(g, x + d1, -y, c, 'col-text', 'middle');
		x+=d2;
		i++;
	}).bind(this));

}

SearchTimeView.prototype.initOptionsMenu = function(){
	var self = this;
	var $menuIcon = $('.opt-menu-icon');
	var $menuContainer = $('.opt-menu-container');
	var $headerContainer = $('.header-container');
	var $menuItem = $('.opt-menu-item');

	$menuIcon.off('click');
	$menuIcon.on('click', function(e){
		$menuContainer.show();
		var l = (window.innerWidth - $menuContainer.width() - $menuIcon.width() - 20)+ 'px';
		var t = ($('.header-container').height() + $menuIcon.height()) + 'px'
		$menuContainer.css({top : t, left : l});
		$menuItem.on('mouseover', function(e){
			$(this).css('background-color', '#4d90fe');
			$(this).css('color', 'white');
		});
		$menuItem.on('mouseout', function(e){
			$(this).css('background-color', '');
			$(this).css('color', 'grey');
		});
	})
	$menuItem.off('click');
	$menuItem.on('click', function(e){
		self.handleDrilldownClick($(this).attr('id'));
	});

}

SearchTimeView.prototype.handleDrilldownClick = function(elemId){
	$('.opt-menu-container').hide();
	var params = {
		qid : this.options.qid,
		mode : elemId === 'olTop' ? 'top' : 'drilldown',
		line : isProductType(this.model.type) ? 'product': 'region' 
	}
	if(!this.model.outliers || params.mode == 'drilldown')
		this.options.controller.getOutlierData(params, this.onOutlierDataResponse.bind(this));
}

SearchTimeView.prototype.onOutlierDataResponse = function(data){
	this.model.outliers = data;
	this.showOutliersForCurrentTimeGroup();
}

SearchTimeView.prototype.showOutliersForCurrentTimeGroup = function(){
	if(!this.model.outliers) return;

	var outliers = [];
	var id = 1;
	$.each($('.bh'), (function(idx, item){
		var t = d3.select(item);
		var label = t.attr('label');
		var tKey = t.attr('tKey');
		
		var olItems = this.model.outliers[tKey];
		if(olItems){
			var olItemsForLabel = _.where(olItems, {label : label});			
			if(olItemsForLabel.length > 0){
				outliers.push({
					rect : t,
					outlier : olItemsForLabel[0].outlier
				});
				id++;
			}
		}
	}).bind(this));
	if(outliers.length > 0)
		this.addMarkersForOutliers(outliers);
}

SearchTimeView.prototype.addMarkersForOutliers = function(outliers){
	var g = this.getGroupById(this.groups.times);
	outliers.forEach((function(ol){
		var x = parseFloat(ol.rect.attr('x'));
		var w = parseFloat(ol.rect.attr('width'));
		var y = parseFloat(ol.rect.attr('height'));
		x = x+w/2;
		var cssCircle = ol.outlier > 0 ? 'ol-pos-circle' : 'ol-neg-circle';
		var olText = ol.outlier > 0 ? '+' : '-';
		this.utils.addBalloon(g, x, y, olText, 50, 5, 'chart-axis', cssCircle, 'ol-text');
	}).bind(this));
}
