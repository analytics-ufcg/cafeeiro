/*
	Global Variables
*/
var incidencia_data = [];
var incidencia_atts = {'cidade' : [],
					   'lavoura' : [],
					   'atts' : []};
var target_att = "taxa_inf_m5";

var scenario_cities_map = {'Varginha-alta-tx5' : ["Varginha", "Varginha-antigo"],
						   'Tudo-alta-tx5' : ["Boa-esperanca", "Carmo-de-minas", "Varginha", "Varginha-antigo"]};

var lavoura_types = ["Adensada", "Larga"];

var model_ci_data = [];

// Time series variables
var has_time_series_chart = false;
var old_incidencia_atts = {'cidade' : [],
						   'lavoura' : [],
						   'atts' : []};

/*
	MAIN CONTROLLER METHOD
*/
function main_controller(){

 	/*
 	 	START DEFINITIONS
 	*/

	// Actions when the scenario changes
	$("#the_scenario").change(function() {
		// Redefine the cities
		redefine_options_select_list($('#parameter_bar_collapse #cidade_list'), 
									 scenario_cities_map[$(this).val()]);
	});

	// Draw the parallel coordinate on demand (when the atemporal tab is selected)
	$('#att_pane a[href="#atemporal_pane"]').on('shown.bs.tab', function (e) {
		show_atts_atemporal_analysis(incidencia_data, incidencia_atts['atts']);
	});

	// Draw the ic on demand (when the atemporal tab is selected)
	$('#prediction_pane a[href="#model_comparison_pane"]').on('shown.bs.tab', function (e) {
		view_prediction_model_comparison(model_ci_data);
	});

	// On change: Attributes
	$("#parameter_bar_collapse").change( function(e){
		get_incidencia_atts();
	});

	// On change: Model selection
	$("#collapse_model_atts").change( function(e){
		get_ic_data_compare_models();
	});

	// Add the tooltips
    $('[data-toggle="tooltip"]').tooltip({placement: "right", container:"body"});

    // Add the model selection items to the accordion
    $('#central_bar a[href="#prediction_pane"]').click(function(e){

    	// Hide all accordion
		$("#parameter_bar_collapse").find('.panel-collapse').each(function(index){
            $(this).removeAttr('style');
            if ($(this).hasClass('in')) {
                $(this).collapse('hide');
            }
        });
		
		// TODO improve
		setTimeout(function () {
	    	$("#accordion_model_atts").find('.panel-collapse').collapse("show");
	    	$("#accordion_model_atts").show();
	    }, 400);
    });

	// Remove the model selection items to the accordion
	$('#central_bar a[href="#att_pane"]').click(function(e){
    	$("#accordion_model_atts").hide();
    });

 	/*
 	 	START RUNS
 	*/

 	// $('#att_pane a[href="#temporal_pane"]').tab('show');

 	// Define the defaults: cidade and lavoura
	redefine_options_select_list($('#parameter_bar_collapse #collapse_general_atts #cidade_list'), 
								 scenario_cities_map[$("#the_scenario").val()]);
	redefine_options_select_list($('#parameter_bar_collapse #collapse_general_atts #lavoura_list'), 
									 lavoura_types);

	// Plot the Attribute Analysis
    get_incidencia_atts();

    // Plot the Model Comparison
	get_ic_data_compare_models();
}

/*
	Model call functions
*/
function get_incidencia_atts(){
	
	// Prepare the call data
	var city = $('#parameter_bar_collapse #collapse_general_atts #cidade_list').val();
	var farm = $('#parameter_bar_collapse #collapse_general_atts #lavoura_list').val().toLowerCase();
	
	var atts = get_att_map();
	atts.push(target_att);

	var call_data = "city=" + city + "&farming_cond=" + farm + "&atts=" + atts.join(",");
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
			incidencia_atts['atts'] = atts;

			show_atts_temporal_analysis();
			show_atts_atemporal_analysis(incidencia_data, incidencia_atts['atts']);

			//TODO meu local nao é aqui, sou das predições
			show_models_atemporal_analysis(incidencia_data, incidencia_atts, target_att);
		}
	});
}

function get_ic_data_compare_models(){
	
	scenario = $('#the_scenario').val();
	att_list = $("#att_list").val();
	metric_list = $("#metric_list").val();

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
	if (att_list != null && metric_list != null){
	
		var call_data = 'scenario=' + scenario + 
						'&att_methods=' + att_list.join() + 
						'&metrics=' + metric_list.join();
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


function redefine_options_select_list(select_list, options){
	select_list.empty();

	$.each(options, function(key, value) {   
	     select_list
	     	.append($("<option></option>")
	        .attr("value", value)
	        .text(value)); 
	});
}