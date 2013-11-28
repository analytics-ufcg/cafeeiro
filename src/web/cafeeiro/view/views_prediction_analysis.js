function view_prediction_temporal_analysis(incidencia_table){

	
}

function view_prediction_model_comparison(ci_data){
	//  Add the GGPLOT image
	$("#model_comparison_pane #comparison_plot").html("<img src='img/plots/prediction-model_comparison-experiment.png'>");
	
	console.log(ci_data);
	// TODO: ADD D3 graph

	plotaIC(ci_data, 0);
}

//plota grafico de erro      
function plotaIC(data, yPos) {
		//Função dos intervalos								
	var margin = {top: 40, right: 10, bottom: 100, left: 40},
	    size = 5,
	    width = 800 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom,
	    x = d3.scale.linear().range([0, width]),
	    y = d3.scale.linear().range([height, 0]),
	    xAxis = d3.svg.axis().scale(x).orient("bottom"),
	    yAxis = d3.svg.axis().scale(y).orient("left");

	var eb = errorBar()
	          .oldXScale(x)
	          .xScale(x)
	          .oldYScale(y)
	          .yScale(y)
	          .yValue(function(d){return d.mean_ci})
	          .xValue(function(d){return null})
	          .xError(function(d){return null})
	          .yError(function(d){return d.lower_ci});


	var color = d3.scale.category10();
	 
	//endereço do plot
	var svg = d3.select("#comparison_plot").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom);

	var plot = svg.append("g")
	      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	      
	  
	  color.domain(d3.keys(data[0]).filter(function(key) { return key == "attribute_method"; }));
	 
	  x.domain([d3.min(data.map(function(d,i) {return i*50+50}))-0.2,d3.max(data.map(function(d,i) { return i*50+50; }))+0.2]);
	  y.domain([d3.min(data.map(function(d) {return (d.lower_ci)})), d3.max(data.map(function(d) { return (d.upper_ci); }))]);

	var circles = plot.selectAll("g")
	        .data(data)
	      .enter().append("g"); 
	      
	var plotErrorbar = circles.append("g")
	      .attr("transform", function(d,i) {return "translate("+ (i*50+50) +","+ y(d.mean_ci) +")"})
	      .style("stroke-dasharray", ("3, 3"))
	      .call(eb);

	var plotCircles = circles.append("circle")
	      .attr("class","circle")
	      .attr("cx", function(d,i) {return i*50+50;})
	      .attr("cy", function(d){return y(d.mean_ci);})
	      .attr("r",5)
	      .attr("fill",function(d) {return color(d.attribute_method);})
	      .style("stroke", "darkgrey");       

	var plotText = circles.append("text")
	      .attr("class","legend")
	      .attr('x', width-140)
	      .attr('y', function(d,i) {return i*21;})
	      .text(function(d) { return d.attribute_method; });
	      
	var plotRect = circles.append("rect")
	      .attr('x', width-150)
	      .attr('y', function(d,i) {return i*20;})
	      .attr('width', 5)
	      .attr('height', 5)
	      .style('fill', function(d) {return color(d.attribute_method);});

	svg.append("g")
	      .attr("class","x axis")
	      .attr("transform", "translate("+ margin.left +"," + (height + margin.top) + ")")
	      .call(xAxis);
	      
	svg.append("g")
	      .attr("class","y axis")
	      .attr("transform","translate("+ margin.left +","+ margin.top +" )")
	      .call(yAxis);

	svg.append("text")
	      .attr("x",margin.left * 10)
	      .attr('y',margin.top - 20)
	      .attr('width', 100)
	      .attr('height', 50)
	      .attr('text-anchor', 'middle')
	      .attr('font-size', '25px')
	      //.text(function(d) { console.log(d.metric); return toString(d.metric); }); //Aqui vai o nome do gŕafico com base na métrica selecionada
	      ;

	//Select and update the circles

	    plotCircles.selectAll("circle")
	      .data(data)
	      .enter().append("circle")
	      .attr("class","circle")
	      //.attr("cx", function(d) {return x(d.temp);})
	      .attr("cy", function(d){return y(d.mean_ci);})
	      .attr("r",5)
	      .attr("fill",function(d, i) {return color(i*50);})
	      .style("stroke", "darkgrey");
	 
	//Select and update the rectangles in legend

	    plotRect.selectAll("rect")
	      .data(data)
	      .enter().append("rect")
	      .attr("class","rect")
	      .attr('x', width-150)
	      .attr('y', function(d,i) {return i*20;})
	      .attr('width', 10)
	      .attr('height', 10)
	      .style('fill', function(d, i) {return color(i*50);});

	//Select and update the text in legend

	    plotText.selectAll("text")
	      .data(data)
	      .enter().append("text")
	      .attr("class","legend")
	      .attr('x', width-40)
	      .attr('y', function(d,i) {return i*21;})
	      .text(function(d, i) { return i*50+50; });


		plotErrorbar.selectAll("g")
	      .data(data)
	      .enter()
	      .append("g")
	      //.attr("transform", function(d) {return "translate("+ x(d.temp) +","+ y(d.mean_ci) +")"})
	      .style("stroke-dasharray", ("3, 3"))
	      .call(eb);

	}


