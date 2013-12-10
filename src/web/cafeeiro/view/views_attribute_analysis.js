function show_atts_atemporal_analysis(incidencia_table, att_names){
    var atemporal_div = '#att_pane #atemporal_pane';

	if ($(atemporal_div).is(":visible") && att_names.length > 0){
		remove_all_d3_svg(atemporal_div);
		plot_parallel_coord(incidencia_table, att_names, atemporal_div);
	}
}

has_time_series_chart = false;
old_incidencia_atts = [];

function create_atts_temporal_analysis(plot_div){
	// remove_all_d3_svg(plot_div);

	requirejs.config({
        "baseUrl": "./",
        "paths": {
            "app": "./js/",
            'moment': './js/moment.min',
            'underscore': './js/underscore-min'
        }
    });

    require(['app/d3.chart'], function (d3Chart) {
        d3Chart.init({ container: plot_div, xDim: 'DateTime' });
      
        d3Chart.addGraph({ 
        	id: 'incidencia', 
        	type: 'analog', 
        	name: 'Incidência', 
        	dataId: 512, 
        	yVal: ['incidencia'], 
        	data: incidencia_data });
		
		d3Chart.render();
    });
}

function show_atts_temporal_analysis(){
    var temporal_div = "#att_pane #temporal_pane";

	if (!has_time_series_chart){
		// Create the temporal analysis time series OBJECT (based on requireJS)
		create_atts_temporal_analysis(temporal_div);
		has_time_series_chart = true;
	}

    require(['app/d3.chart'], function (d3Chart) {

        atts_to_remove = _.difference(old_incidencia_atts, incidencia_atts);
        atts_to_add = _.difference(incidencia_atts, old_incidencia_atts);

    	for (var i = 0; i < atts_to_add.length; i++) {
            att = atts_to_remove[i];

    		d3Chart.removeGraph(att);
    	};

		for (var i = 0; i < atts_to_add.length; i++) {
			att = atts_to_add[i];
            
            d3Chart.addGraph({ 
            	id: att, 
            	type: 'analog', 
            	name: att, 
            	dataId: 513 + i, 
            	yVal: [att], 
            	data: incidencia_data
            });
		};
        
        d3Chart.render();

        // Keep the selected atts to compare with the ones in the next call
        old_incidencia_atts = incidencia_atts;
    });
}

function remove_all_d3_svg(div_name){
  d3.select(div_name).selectAll("svg").remove();
}