function show_atts_atemporal_analysis(){
    var atemporal_div = '#att_pane #atemporal_pane';
    var att_names = incidencia_atts['target_att'].concat(incidencia_atts['atts']);

    if ($(atemporal_div).is(":visible") && att_names.length > 0){

        remove_all_d3_svg(atemporal_div);
		plot_parallel_coord(incidencia_data, att_names, atemporal_div);
	}
}

function show_atts_temporal_analysis(){

    function create_atts_temporal_analysis(plot_div){

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
        });
    }

    var temporal_div = "#att_pane #temporal_pane";

	if (!has_time_series_chart){
		// Create the temporal analysis time series OBJECT (based on requireJS)
		create_atts_temporal_analysis(temporal_div);
		has_time_series_chart = true;
	}

    require(['app/d3.chart'], function (d3Chart) {

        var atts_to_remove = [], atts_to_add = [], order_atts_to_add = [];

        // Define the attributes to remove and/or to add in the d3.chart
        if (incidencia_atts['cidade'] != old_incidencia_atts['cidade'] || 
            incidencia_atts['lavoura'] != old_incidencia_atts['lavoura'] || 
            incidencia_atts['carga'] != old_incidencia_atts['carga']) {
            
            // Case when the dataset is changed (by city, farm_condition or load)
            atts_to_remove = old_incidencia_atts['target_att'].concat(old_incidencia_atts['atts']);
            atts_to_add = incidencia_atts['target_att'].concat(incidencia_atts['atts']);
        }else{
            // Case when only a set of attributes was added or removed (in most cases only one)
            atts_to_remove = _.difference(old_incidencia_atts['target_att'].concat(old_incidencia_atts['atts']), 
                                          incidencia_atts['target_att'].concat(incidencia_atts['atts']));
            atts_to_add = _.difference(incidencia_atts['target_att'].concat(incidencia_atts['atts']), 
                                       old_incidencia_atts['target_att'].concat(old_incidencia_atts['atts']));
        }

        // Define the order of each att
        for (var i = 0; i < atts_to_add.length; i++) {
            order_atts_to_add[i] = incidencia_atts['atts'].indexOf(atts_to_add[i]);
        };

        // REMOVE ATTS
        for (var i = 0; i < atts_to_remove.length; i++) {
            att = atts_to_remove[i];
            d3Chart.removeGraph(att);
        }

        // ADD ATTS
        for (var i = 0; i < atts_to_add.length; i++) {
            att = atts_to_add[i];

            d3Chart.addGraph({ 
                id: att, 
                name: att, 
                dataId: i, 
                yVal: [att], 
                data: incidencia_data,
                order: order_atts_to_add[i]
            });
        };

        // Render the time-series
        d3Chart.render();

        // Keep the selected atts to compare with the ones in the next call
        old_incidencia_atts = _.clone(incidencia_atts);
    }); 
}

function remove_all_d3_svg(div_name){
  d3.select(div_name).selectAll("svg").remove();
}