function plot_parallel_coord(att_data, att_names, plot_div) {
  
  var div_width = $(plot_div).width(),
      div_height = 600;
  
  var m = {left:70, right:70, top:40, bottom:20},
      w = div_width - m.left - m.right,
      h = div_height - m.top - m.bottom;

  var x = d3.scale.ordinal().domain(att_names).rangePoints([0, w]),
      y = {};

  var line = d3.svg.line(),
      axis = d3.svg.axis().orient("left"),
      foreground;

  var svg = d3.select(plot_div).append("svg:svg")
      .attr("width", "100%")
      .attr("height", div_height + m.top + m.bottom)
    .append("svg:g")
      .attr("transform", "translate(" + m.left + "," + m.top + ")");

  // Create a scale and brush for each att_name.
  att_names.forEach(function(col_name) {

    // Coerce values to numbers.
    att_data.forEach(function(p) { p[col_name] = +p[col_name]; });

    y[col_name] = d3.scale.linear()
        .domain(d3.extent(att_data, function(p) { return p[col_name]; }))
        .range([h, 0]);

    y[col_name].brush = d3.svg.brush()
        .y(y[col_name])
        .on("brush", brush);     
 });

  // Add a legend.
  // var legend = svg.selectAll("g.legend")
  //     .data(species)
  //   .enter().append("svg:g")
  //     .attr("class", "legend")
  //     .attr("transform", function(d, i) { return "translate(0," + (i * 20 + 584) + ")"; });

  // legend.append("svg:line")
  //     .attr("class", String)
  //     .attr("x2", 8);

  // legend.append("svg:text")
  //     .attr("x", 12)
  //     .attr("dy", ".31em")
  //     .text(function(d) { return "Iris " + d; });

  // Add foreground lines.
  foreground = svg.append("svg:g")
      .attr("class", "foreground")
    .selectAll("path")
      .data(att_data)
    .enter().append("svg:path")
      .attr("d", path)
      .attr("class", function(d) { 
        if (d[target_att] <= 0){
          return "inf_smaller_m5";
        }else{
          return "inf_greater_m5";
        }});

  // Add a group element for each att_name.
  var g = svg.selectAll(".attribute")
      .data(att_names)
    .enter().append("svg:g")
      .attr("class", "attribute")
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
      .call(d3.behavior.drag()
      .origin(function(d) { return {x: x(d)}; })
      .on("dragstart", dragstart)
      .on("drag", drag)
      .on("dragend", dragend));

  // Add an axis and title.
  g.append("svg:g")
      .attr("class", "axis")
      .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
    .append("svg:text")
      .attr("text-anchor", "middle")
      .attr("y", -9)
      .text(String);

  // Add a brush for each axis.
  g.append("svg:g")
      .attr("class", "brush")
      .each(function(d) { d3.select(this).call(y[d].brush); })
    .selectAll("rect")
      .attr("x", -8)
      .attr("width", 16);

  function dragstart(d) {
    i = incidencia_atts.indexOf(d);
  }

  function drag(d) {
    x.range()[i] = d3.event.x;
    incidencia_atts.sort(function(a, b) { return x(a) - x(b); });
    g.attr("transform", function(d) { return "translate(" + x(d) + ")"; });
    foreground.attr("d", path);
  }

  function dragend(d) {
    x.domain(incidencia_atts).rangePoints([0, w]);
    var t = d3.transition().duration(500);
    t.selectAll(".attribute").attr("transform", function(d) { return "translate(" + x(d) + ")"; });
    t.selectAll(".foreground path").attr("d", path);
  }
  // Returns the path for a given data point.
  function path(d) {
    return line(incidencia_atts.map(function(p) { return [x(p), y[p](d[p])]; }));
  }

  // Handles a brush event, toggling the display of foreground lines.
  function brush() {
    var actives = incidencia_atts.filter(function(p) { return !y[p].brush.empty(); }),
        extents = actives.map(function(p) { return y[p].brush.extent(); });
    foreground.classed("fade", function(d) {
      return !actives.every(function(p, i) {
        return extents[i][0] <= d[p] && d[p] <= extents[i][1];
      });
    });
  }
}