function view_prediction_temporal_analysis(incidencia_table){

	
}

function view_prediction_model_comparison(ci_data){
	//  Add the GGPLOT image
	//$("#model_comparison_pane #comparison_plot").html("<img src='img/plots/prediction-model_comparison-experiment.png'>");
	
	var mapa = {};
	for (var i = 0; i <= ci_data.length-1; i++) {
		if(mapa[ci_data[i]["metric"]]==null) {
			mapa[ci_data[i]["metric"]] = [];
		}
		mapa[ci_data[i]["metric"]].push(ci_data[i]);
	};

	for (var m in mapa) {
		plotaIC(mapa[m]);
	};
}

//plota grafico de erro      
function plotaIC(data) {
		//Função dos intervalos								
	var margin = {top: 40, right: 150, bottom: 100, left: 40},
	    size = 5,
	    width = 800 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom,
	    x = d3.scale.linear().range([0, width]),
	    y = d3.scale.linear().range([height, 0]),
	    xAxis = d3.svg.axis().scale(x).orient("bottom"),
	    yAxis = d3.svg.axis().scale(y).orient("left");

	var eb = errorBar(function(d) {return color(d.attribute_method);})
	          .oldXScale(x)
	          .xScale(x)
	          .oldYScale(y)
	          .yScale(y)
	          .yValue(function(d){return d.mean_ci})
	          .xValue(function(i){return null})
	          .xError(function(d){return null})
	          .yError(function(d){return (d.upper_ci-d.mean_ci)});


	var color = d3.scale.category10();
	 
	//endereço do plot
	var svg = d3.select("#comparison_plot").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom);

	var plot = svg.append("g")
	      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	      
	  
	  color.domain(d3.keys(data[0]).filter(function(key) { return key == "attribute_method"; }));
	 
	  x.domain([d3.min(data.map(function(d,i) {return (i*2+1);}))-1,
	  			d3.max(data.map(function(d,i) { return (i*2+1); }))+1]);
	  y.domain([d3.min(data.map(function(d) {return (d.lower_ci);})) - (0.003*d3.min(data.map(function(d) {return (d.lower_ci);}))), 
	  	d3.max(data.map(function(d) { return (d.upper_ci); })) + (0.003*d3.max(data.map(function(d) { return (d.upper_ci); })))]);

	var circles = plot.selectAll("g")
	        .data(data)
	      .enter().append("g"); 
	      
	var plotErrorbar = circles.append("g")
	      .attr("transform", function(d,i) {return "translate("+ x(i*2+1) +","+ y(d.mean_ci) +")"})
	      .call(eb);

	var plotCircles = circles.append("circle")
	      .attr("class","circle")
	      .attr("cx", function(d,i) {return x(i*2+1);})
	      .attr("cy", function(d){return y(d.mean_ci);})
	      .attr("r",3)
	      .attr("fill",function(d) {return color(d.attribute_method);})
	      .style("stroke", "darkgrey");       

	var plotText = circles.append("text")
	      .attr("class","legend")
	      .attr('x', width+10)
	      .attr('y', function(d,i) {return i*21;})
	      .text(function(d) { return d.attribute_method; });
	      
	var plotRect = circles.append("rect")
	      .attr('x', width)
	      .attr('y', function(d,i) {return i*20;})
	      .attr('width', 5)
	      .attr('height', 5)
	      .style('fill', function(d) {return color(d.attribute_method);});

	svg.append("g")
	      .attr("class","x axis")
	      .attr("transform", "translate("+ margin.left +"," + (height + margin.top) + ")")
	      .call(xAxis)
	      .selectAll("text").remove();
	      
	svg.append("g")
	      .attr("class","y axis")
	      .attr("transform","translate("+ margin.left +","+ margin.top +" )")
	      .call(yAxis);

	svg.append("text")
	      .attr("x",margin.left * 9)
	      .attr('y',margin.top - 20)
	      .attr('width', 100)
	      .attr('height', 50)
	      .attr('text-anchor', 'middle')
	      .attr('font-size', '25px')
	      .text( data[0].metric ); 

	}