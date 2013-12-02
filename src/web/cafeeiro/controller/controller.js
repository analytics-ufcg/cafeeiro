/*
	Global Variables
*/
var incidencia_data = [];
var incidencia_atts = [];

var scenario_cities_map = {};
scenario_cities_map['Varginha-alta-tx5'] = ["Varginha", "Varginha-antigo"];
scenario_cities_map['Tudo-alta-tx5'] = ["Boa-esperanca", "Carmo-de-minas", "Varginha", "Varginha-antigo"];

lavoura_types = ["larga", "adensada"];

/*
	MAIN CONTROLLER METHOD
*/
function main_controller(){

	$("#atts_form").submit(function(e){
		e.preventDefault(); 
		get_incidencia_atts();
	})

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
									 scenario_cities_map[$(this).val()], 
									 true);
	});

	// Define the defaults: cidade and lavoura
	redefine_options_select_list($('#att_pane #atts_bar #cidade_list'), 
								 scenario_cities_map[$("#the_scenario").val()], 
								 true);
	redefine_options_select_list($('#att_pane #atts_bar #lavoura_list'), 
									 lavoura_types, 
									 true);
}

/*
	Model call functions
*/
function get_incidencia_atts(){
	
	var att_map = get_att_map();

	// Prepare the call data

	// CIDADEs
	var cidades = $('#att_pane #atts_bar #cidade_list').val();

	if (cidades === null){
		redefine_options_select_list($('#att_pane #atts_bar #cidade_list'), 
									 scenario_cities_map[$("#the_scenario").val()], 
									 true);
		cidades = $('#att_pane #atts_bar #cidade_list').val();
	}

	// LAVOURAs
	var lavouras = $('#att_pane #atts_bar #lavoura_list').val();

	if (lavouras === null){
		redefine_options_select_list($('#att_pane #atts_bar #lavoura_list'), 
							 lavoura_types, 
							 true);
		lavouras = $('#att_pane #atts_bar #lavoura_list').val();
	}

	// OUTPUT ATTRIBUTEs
	var atts = [];

	if (att_map["meteorological"].length > 0){
		atts = atts.concat(att_map['meteorological']);
	}
	if (att_map["target"].length > 0){
		atts = atts.concat(att_map['target']);
	}
	atts.push("taxa_inf_m5");

	var call_data = "cities=" + cidades.join(",") + "&farming_cond=" + lavouras.join(",") + "&atts=" + atts.join(",");	
	
	console.log(call_data);

	// Disable the button
	$("#atts_submit_btn").button('loading');

	$.ajax({
		type: 'GET',
		dataType: 'json',
		url: 'model/model_incidencia_atts_with_conditions.php',
		async: true,
		data: call_data,
		success: function(incidencia_table) {
			// Copy the data/atts to the client memory
			incidencia_data = incidencia_table;
			incidencia_atts = atts;
			
			show_atts_atemporal_analysis(incidencia_data, incidencia_atts);

			// Release the button
			$("#atts_submit_btn").button('reset');
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
	result['target'] = [];	

	if (atts_serialized == ""){
		return result;
	} else{
		var all_atts = atts_serialized.split("&");

		for (var i = all_atts.length - 1; i >= 0; i--) {
			var att = all_atts[i].replace("=on", "");
			
			if (att == 'incidencia' || att == 'taxa_inf' || att == 'taxa_inf_m5'){
				result['target'].push(att);
			}else{
				result['meteorological'].push(att);
			}
		}
		return result;
	}
}


function redefine_options_select_list(select_list, options, all_selected){
	select_list.empty();

	$.each(options, function(key, value) {   
	     select_list
	     	.append($("<option></option>")
	        .attr("value", value)
	        .attr("selected", all_selected)
	        .text(value)); 
	});
}