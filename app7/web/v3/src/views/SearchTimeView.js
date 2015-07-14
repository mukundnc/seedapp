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
		if(false === $(e.originalEvent.srcElement).hasClass('opt-menu-img'))
				$('.opt-menu-container').hide();
	});
}

SearchTimeView.prototype.clear = function(){
	this.getGroupById(this.groups.axes).html('');
	this.getGroupById(this.groups.times).html('');
	this.getGroupById(this.groups.backnext).html('');
}

SearchTimeView.prototype.render = function(){
	this.clear();
	var g = this.getGroupById(this.groups.axes);
	this.addAxes();
	this.showTimeView();
	this.initOptionsMenu();
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
	var g = this.getGroupById(this.groups.times);
	g.html('');

	var timeGroup = this.model.timeGroups[this.currTimeModelIndex];
	var allHeights = [];

	for(var key in timeGroup){
		var bars = timeGroup[key];
		var i = 1;
		bars.forEach((function(bar){
			if(bar.h > 0){
				var gR = this.utils.addRect(g, bar.x, bar.y, bar.w, 0, 'bar-' + i + ' bh');
				gR.attr({label : bar.label, tKey : bar.tKey});
				allHeights.push(bar.h);
			}
			i++;
		}).bind(this));
	}
	this.addTimeGroupContentMarkers(g);
	this.animateCategoryHeights(g, allHeights);
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
		var l = (window.innerWidth - $menuContainer.width() - $menuIcon.width() - 25 )+ 'px';
		var t = ($('.header-container').height() + 10) + 'px'
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
	this.options.controller.getOutlierData(params, this.onOutlierDataResponse.bind(this));
}

SearchTimeView.prototype.onOutlierDataResponse = function(data){
	this.model.outliers = data;
	console.log(data);
}
