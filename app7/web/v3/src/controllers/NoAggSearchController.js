function NoAggSearchController(appController){
	this.appController = appController;
	this.qidResults = {};
	this.utils = new SvgUtils();
}

NoAggSearchController.prototype.renderView = function(qid, apiRes){
	if(!this.qidResults[qid] && apiRes)
		this.qidResults[qid] = apiRes;

	var results = this.qidResults[qid];

	d3.selectAll('.svg-view').html('');

	var data = {
		total : 0,
		records : []
	};

	results.results.forEach(function(r){
		data.total += r.hits.total,
		r.hits.hits.forEach(function(h){
			data.records.push(h);
		});
		
	});
	data.records = _.sortBy(data.records, function(r){
		return r._source.product.model;
	});

	var g = this.utils.getGroupByClassName('res-table-group');
	g.attr('transform', this.utils.getCodtSystemXForm(0, 500));
	this.utils.addTextXForm(g, $('.svg-container').width()/2.5, -450, 'TOTAL SALES - ' + data.total, 'sales-header');
	var xStart = 70;
	var yStart = 400;
	var w = 120;
	var h = 25;
	var headers = ['Model', 'Brand', 'Type', 'City', 'State', 'Region', 'Date', 'Count'];
	headers.forEach((function(head){
		var gR = this.utils.addRectLabel(g, xStart, yStart, w, h, head, 'res-head', 'sf-rect', 'sf-text', 'middle');
		gR.select('text').attr('x', xStart+w/2);
		xStart += w;
	}).bind(this));
	yStart -= h;
	xStart = 70;

	var res = results.results[0].hits.hits;

	data.records.forEach((function(r){
		var p = r._source.product;
		var rg = r._source.region;
		headers = [p.model, p.brand, p.type, rg.city, rg.state, rg.region, r._source.timestamp, '1'];
		headers.forEach((function(head){
			var gR = this.utils.addRectLabel(g, xStart, yStart, w, h, head, 'res-head', 'sf-rect', 'sf-text', 'middle');
			gR.select('text').attr('x', xStart+w/2);
			xStart += w;
		}).bind(this));
		yStart -= h;
		xStart = 70;
	}).bind(this));
}