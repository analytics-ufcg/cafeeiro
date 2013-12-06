function show_atts_atemporal_analysis(incidencia_table, att_names, target_att_name){
	if ($('#atts_analysis #central_bar #atemporal_pane').is(":visible") && att_names.length > 0){
		remove_all_d3_svg("#atts_analysis #central_bar #atemporal_pane");

		plot_parallel_coord(incidencia_table, att_names, target_att_name);
	}
}

has_time_series_chart = false;
time_series_ids_atts = [];

function create_atts_temporal_analysis(){
	remove_all_d3_svg("#atts_analysis #central_bar #temporal_pane");

	requirejs.config({
        "baseUrl": "./",
        "paths": {
            "app": "./js/",
            'moment': './js/moment.min',
            'underscore': './js/underscore-min'
        }
    });

    require(['app/d3.chart'], function (d3Chart) {
        d3Chart.init({ container: '#atts_analysis #central_bar #temporal_pane', xDim: 'DateTime' });
      
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
	if (!has_time_series_chart){
		// Create the temporal analysis time series OBJECT (based on requireJS)
		create_atts_temporal_analysis();
		has_time_series_chart = true;
	}

    require(['app/d3.chart'], function (d3Chart) {

    	for (var i = time_series_ids_atts.length - 1; i >= 0; i--) {
    		old_att_id = time_series_ids_atts[i];

    		d3Chart.removeGraph(old_att_id);
    	};
      	time_series_ids_atts = [];

		for (var i = 0; i < incidencia_atts.length; i++) {
			att = incidencia_atts[i];
            
            d3Chart.addGraph({ 
            	id: att, 
            	type: 'analog', 
            	name: att, 
            	dataId: 513 + i, 
            	yVal: [att], 
            	data: incidencia_data
            });

    		time_series_ids_atts.push(att);
		};
        
        d3Chart.render();
    });
}

function remove_all_d3_svg(div_name){
  d3.select(div_name).selectAll("svg").remove();
}