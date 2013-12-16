/*
	Global Variables
*/
var incidencia_data = [];
var incidencia_atts = {'cidade' : [],
					   'lavoura' : [],
					   'carga' : [],
					   'atts' : []};

var city_lavoura_types = {};
var all_scenarios = [];
var model_ci_data = [];

// Time series variables
var has_time_series_chart = false;
var old_incidencia_atts = {'cidade' : [],
						   'lavoura' : [],
						   'carga' : [],
						   'target_att' : [],
						   'atts' : []};

/*
	MAIN CONTROLLER METHOD
*/
function main_controller(){

 	/*
 	 	START DEFINITIONS
 	*/

	// Actions when the city changes
	$("#att_analysis_bar_collapse #collapse_database_atts #cidade_list").change(function() {
		
		var city_selected = $(this).val();
		redefine_options_select_list($('#att_analysis_bar_collapse #collapse_database_atts #lavoura_list'), 
										 _.keys(city_lavoura_types[city_selected]));
		
		var lavoura_selected = $("#att_analysis_bar_collapse #collapse_database_atts #lavoura_list").val();
		redefine_options_select_list($('#att_analysis_bar_collapse #collapse_database_atts #carga_list'), 
										 _.keys(city_lavoura_types[city_selected][lavoura_selected]));
	});

	// Actions when the lavoura changes
	$("#att_analysis_bar_collapse #collapse_database_atts #lavoura_list").change(function() {
		
		var city_selected = $("#att_analysis_bar_collapse #collapse_database_atts #cidade_list").val();
		var lavoura_selected = $(this).val();
		redefine_options_select_list($('#att_analysis_bar_collapse #collapse_database_atts #carga_list'), 
										 _.keys(city_lavoura_types[city_selected][lavoura_selected]));
	});

	// Draw the parallel coordinate on demand (when the atemporal tab is selected)
	$('#att_pane a[href="#atemporal_pane"]').on('shown.bs.tab', function (e) {
		show_atts_atemporal_analysis();
	});

	// Draw the ic on demand (when the prediction_pane tab is selected)
	$('#central_bar a[href="#prediction_pane"]').on('shown.bs.tab', function (e) {
		view_prediction_model_comparison(model_ci_data);
	});

	// On change: Att Analysis Collapses
	$("#att_analysis_bar_collapse").change( function(e){
		get_incidencia_atts();
	});

	// On change: Att Analysis Collapses
	$("#prediction_analysis_bar_collapse").change( function(e){
		get_ic_data_compare_models();
	});

	// Add the tooltips
    $('[data-toggle="tooltip"]').tooltip({placement: "right", container:"body"});

    // Events on Tab changes of central_bar
    $('#central_bar a[href="#prediction_pane"]').click(function(e){
    	
    	// Hide the DIVs
    	$("#att_analysis_bar_collapse").hide();
	    
	    // Show the prediction analysis collapses
	    $("#prediction_analysis_bar_collapse").show();
    });

	$('#central_bar a[href="#att_pane"]').click(function(e){
		// Show the meteorological and special selection DIVs
    	$("#att_analysis_bar_collapse").show();

		// Hide the model selection DIV
    	$("#prediction_analysis_bar_collapse").hide();
    });

 	/*
 	 	START RUNS
 	*/
 	get_incidencia_database();

 	// Define the defaults: cidade and lavoura
	redefine_options_select_list($('#att_analysis_bar_collapse #collapse_database_atts #cidade_list'), 
								 _.keys(city_lavoura_types));
	
	var city_selected = $("#att_analysis_bar_collapse #collapse_database_atts #cidade_list").val();
	redefine_options_select_list($('#att_analysis_bar_collapse #collapse_database_atts #lavoura_list'), 
									 _.keys(city_lavoura_types[city_selected]));
	
	var lavoura_selected = $("#att_analysis_bar_collapse #collapse_database_atts #lavoura_list").val();
	redefine_options_select_list($('#att_analysis_bar_collapse #collapse_database_atts #carga_list'), 
									 _.keys(city_lavoura_types[city_selected][lavoura_selected]));

	// Plot the Attribute Analysis
    get_incidencia_atts();

    get_experiment_scenarios();

    // Plot the Model Comparison
	get_ic_data_compare_models();
}

/*
	Model call functions
*/

function get_incidencia_database(){
	$.ajax({
		type: 'GET',
		dataType: 'json',
		url: 'model/model_incidencia_cidade_lavoura_carga.php',
		async: false,
		data: '',
		success: function(city_table) {
			// Copy the data to the client memory			
			for (var i = 0; i < city_table.length; i++) {
				var city_row = city_table[i];
				var cidade = city_row['cidade'];
				var lavoura = city_row['lavoura'];
				var carga = city_row['carga'];

				if (_.isUndefined(city_lavoura_types[cidade])){
					city_lavoura_types[cidade] = {};
				}
				if(_.isUndefined(city_lavoura_types[cidade][lavoura])){
					city_lavoura_types[cidade][lavoura] = {};
				}
				if(_.isUndefined(city_lavoura_types[cidade][lavoura][carga])){
					city_lavoura_types[cidade][lavoura][carga] = [];
				}
			};
		}
	});
}

function get_experiment_scenarios(){
	$.ajax({
		type: 'GET',
		dataType: 'json',
		url: 'model/model_experiment_scenarios.php',
		async: false,
		data: '',
		success: function(scenarios) {
			redefine_options_select_list($('#the_scenario'), 
									 scenarios);
		}
	});
}

function get_incidencia_atts(){
	
	// Prepare the call data
	var city = $('#att_analysis_bar_collapse #collapse_database_atts #cidade_list').val();
	var farm = $('#att_analysis_bar_collapse #collapse_database_atts #lavoura_list').val();
	var carga = $('#att_analysis_bar_collapse #collapse_database_atts #carga_list').val();
	var target_att_val = $("#target_att_form").serialize().split("=")[1];
	var atts = get_att_map();

	var call_data = "city=" + city + "&farming_cond=" + farm + "&load=" + carga + "&target_att=" + target_att_val + "&atts=" + atts.join(",");
	console.log(call_data);

	$.ajax({
		type: 'GET',
		dataType: 'json',
		url: 'model/model_incidencia_atts_with_conditions.php',
		async: true,
		data: call_data,
		success: function(incidencia) {
			
			// Copy the data/atts to the client memory
			incidencia_data = incidencia;
			incidencia_atts['cidade'] = city;
			incidencia_atts['lavoura'] = farm;
			incidencia_atts['carga'] = carga;
			incidencia_atts['target_att'] = [target_att_val];
			incidencia_atts['atts'] = atts;

			show_atts_temporal_analysis();
			show_atts_atemporal_analysis();
		}
	});
}

function get_ic_data_compare_models(){
	
	scenario = $('#the_scenario').val();

	att_list = get_model_map("#att_selection_form");
	metric_list = get_model_map("#metric_selection_form");

	// model_ci_data = [{"attribute_method":"Subjetivo-M2","model":"Random Forest - Dissertation","metric":"Erro","mean_ci":0.194023787358787,"lower_ci":0.191513177211681,"upper_ci":0.196534397505894,"model_and_att_method":"Random Forest - Dissertation / Subjetivo-M2"},
	// 					{"attribute_method":"Subjetivo-M2","model":"Random Forest - Dissertation","metric":"Sensitividade","mean_ci":0.804433405068936,"lower_ci":0.800721444980571,"upper_ci":0.808145365157301,"model_and_att_method":"Random Forest - Dissertation / Subjetivo-M2"},
	// 					{"attribute_method":"Subjetivo-M2","model":"Random Forest - Dissertation","metric":"FP-Rate","mean_ci":0.190371779990066,"lower_ci":0.186650225860727,"upper_ci":0.194093334119406,"model_and_att_method":"Random Forest - Dissertation / Subjetivo-M2"},
	// 					{"attribute_method":"Subjetivo-M3","model":"Random Forest - Dissertation","metric":"Erro","mean_ci":0.193078193943944,"lower_ci":0.190564406633085,"upper_ci":0.195591981254803,"model_and_att_method":"Random Forest - Dissertation / Subjetivo-M3"},
	// 					{"attribute_method":"Subjetivo-M3","model":"Random Forest - Dissertation","metric":"Sensitividade","mean_ci":0.805807811555861,"lower_ci":0.802416728728805,"upper_ci":0.809198894382917,"model_and_att_method":"Random Forest - Dissertation / Subjetivo-M3"},
	// 					{"attribute_method":"Subjetivo-M3","model":"Random Forest - Dissertation","metric":"FP-Rate","mean_ci":0.189397181506724,"lower_ci":0.184801425068348,"upper_ci":0.1939929379451,"model_and_att_method":"Random Forest - Dissertation / Subjetivo-M3"},
	// 					{"attribute_method":"Subjetivo-M3-IncW1","model":"Random Forest - Dissertation","metric":"Erro","mean_ci":0.190472970970971,"lower_ci":0.186010878254776,"upper_ci":0.194935063687165,"model_and_att_method":"Random Forest - Dissertation / Subjetivo-M3-IncW1"},
	// 					{"attribute_method":"Subjetivo-M3-IncW1","model":"Random Forest - Dissertation","metric":"Sensitividade","mean_ci":0.803298765585172,"lower_ci":0.79829724487755,"upper_ci":0.808300286292793,"model_and_att_method":"Random Forest - Dissertation / Subjetivo-M3-IncW1"},
	// 					{"attribute_method":"Subjetivo-M3-IncW1","model":"Random Forest - Dissertation","metric":"FP-Rate","mean_ci":0.182465574308485,"lower_ci":0.175174192770056,"upper_ci":0.189756955846914,"model_and_att_method":"Random Forest - Dissertation / Subjetivo-M3-IncW1"}];

	// view_prediction_model_comparison(model_ci_data);
	// Check the input parameters
	if (att_list != null && metric_list != null && att_list.length > 0 && metric_list.length > 0){
	
		var call_data = 'scenario=' + scenario + 
						'&att_methods=' + att_list.join(",") + 
						'&metrics=' + metric_list.join(",");
		console.log(call_data);

		$.ajax({
			type: 'GET',
			dataType: 'json',
			url: 'model/model_experiment_compare_models.php',
			async: true,
			data: call_data,
			success: function(ci_data_text) {
				// We need to parse it again
				model_ci_data = $.parseJSON(ci_data_text);

				view_prediction_model_comparison(model_ci_data);
			}
		});
	}
}

/*
	Auxiliar Functions
*/

function get_att_map(){

	var result = [];

	var atts_serialized = $("#meteorologic_atts_form").serialize() + "&" + $("#special_atts_form").serialize();
	var all_atts = atts_serialized.split("&");

	for (var i = 0; i < all_atts.length; i++) {
		att = all_atts[i];
		if (att != ""){
			result.push(att.replace("=on", ""));
		}
	}
	return result;
}

function get_model_map(form){

	var result = [];

	var atts_serialized = $(form).serialize() + "";
	var all_atts = atts_serialized.split("&");

	for (var i = 0; i < all_atts.length; i++) {
		att = all_atts[i];
		if (att != ""){
			result.push(att.replace("=on", ""));
		}
	}
	return result;
}


function redefine_options_select_list(select_list, options){
	select_list.empty();

	$.each(options, function(key, value) {   
	     select_list
	     	.append($("<option></option>")
	        .attr("value", value)
	        .text(value)); 
	});
}