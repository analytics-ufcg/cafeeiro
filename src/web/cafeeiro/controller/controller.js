/*
	Global Variables
*/
var incidencia_data = [];
var incidencia_atts = [];
var target_att = "taxa_inf_m5";
var date_time_att = "data";

var scenario_cities_map = {};
scenario_cities_map['Varginha-alta-tx5'] = ["Varginha", "Varginha-antigo"];
scenario_cities_map['Tudo-alta-tx5'] = ["Boa-esperanca", "Carmo-de-minas", "Varginha", "Varginha-antigo"];

lavoura_types = ["Adensada", "Larga"];

/*
	MAIN CONTROLLER METHOD
*/
function main_controller(){

 	/*
 	 	START DEFINITIONS
 	*/
	$("#model_comparison_form").submit(function(e){
		e.preventDefault(); 
		compare_models_with_ic();
	});

	// Draw the parallel coordinate on demand (when the atemporal tab is selected)
	$('#atts_analysis #central_bar a[href="#atemporal_pane"]').on('shown', function (e) {
		show_atts_atemporal_analysis(incidencia_data, incidencia_atts);
	});

	// Actions when the scenario changes
	$("#the_scenario").change(function() {
		// Redefine the cities
		redefine_options_select_list($('#att_pane #atts_bar #cidade_list'), 
									 scenario_cities_map[$(this).val()]);
	});

	// On change atts bar
	$("#atts_bar").change( function(e){
		get_incidencia_atts();
	});


 	/*
 	 	START RUNS
 	*/
 	// Define the defaults: cidade and lavoura
	redefine_options_select_list($('#att_pane #atts_bar #cidade_list'), 
								 scenario_cities_map[$("#the_scenario").val()]);
	redefine_options_select_list($('#att_pane #atts_bar #lavoura_list'), 
									 lavoura_types);

	// Plot the all Attribute Analysis
    get_incidencia_atts();


    // $('#tab-content').tooltip();
    $('[data-toggle="tooltip"]').tooltip({placement: "right"});

}

/*
	Model call functions
*/
function get_incidencia_atts(){
	
	var att_map = get_att_map();

	// Prepare the call data
	var city = $('#att_pane #atts_bar #cidade_list').val();
	var farm = $('#att_pane #atts_bar #lavoura_list').val().toLowerCase();
	
	var atts = []
	if (att_map["meteorological"].length > 0){
		atts = atts.concat(att_map['meteorological']);
	}
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
			incidencia_atts = atts;
			console.log(incidencia);

			show_atts_atemporal_analysis(incidencia_data, incidencia_atts, target_att);
		}
	});
}

function compare_models_with_ic(){
	
	scenario = $('#the_scenario').val();
	att_list = $("#att_list").val();
	metric_list = $("#metric_list").val();

	// Check the input parameters
	if (att_list != null && metric_list != null){
	
		var call_data = 'scenario=' + scenario + 
						'&att_methods=' + att_list.join() + 
						'&metrics=' + metric_list.join();

		console.log(call_data);

	 	$("#model_comparison_submit_btn").button('loading');
		$.ajax({
			type: 'GET',
			dataType: 'json',
			url: 'model/model_experiment_compare_models.php',
			async: true,
			data: call_data,
			success: function(ci_data_text) {
				// We need to parse it again
				var ci_data = $.parseJSON(ci_data_text);

				view_prediction_model_comparison(ci_data);

				$("#model_comparison_submit_btn").button('reset');
			}
		});
	}
}

/*
	Auxiliar Functions
*/

function get_att_map(){
	atts_serialized = $("#atts_form").serialize();

	var result = {};
	result['meteorological'] = []

	if (atts_serialized == ""){
		return result;
	} else{
		var all_atts = atts_serialized.split("&");

		for (var i = all_atts.length - 1; i >= 0; i--) {
			result['meteorological'].push(all_atts[i].replace("=on", ""));
		}
		return result;
	}
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