/*
	MAIN CONTROLLER METHOD
*/
function main_controller(){

	$("#atts_form").submit(function(e){
		// Avoid refreshing the page
		e.preventDefault(); 
		get_incidencia_atts();
	})

	$("#model_comparison_form").submit(function(e){
		// Avoid refreshing the page
		e.preventDefault(); 
		compare_models_with_ic();
	});

	// $("#prediction_scenario_select").change(function(e){
	// 	// Avoid refreshing the page
	// 	get_incidencia_data();
	// });

}

function get_att_map(atts_serialized){
	var result = {};
	result['general'] = []
	result['meteorological'] = []
	result['target'] = [];	

	if (atts_serialized == ""){
		return result;
	} else{
		var all_atts = atts_serialized.split("&");

		for (var i = all_atts.length - 1; i >= 0; i--) {
			var att = all_atts[i].replace("=on", "");
			
			if (att == 'cidade' || att == 'lavoura'){
				result['general'].push(att);
			}else if (att == 'incidencia' || att == 'taxa_inf' || att == 'taxa_inf_m5'){
				result['target'].push(att);
			}else{
				result['meteorological'].push(att);
			}
		}
		return result;
	}
}

function get_incidencia_atts(){
	var att_map = get_att_map($("#atts_form").serialize());

	var scenario = $('#the_scenario').val();
	var atts = [];

	if (att_map["general"].length > 0){
		atts = atts.concat(att_map['general']);
	}
	if (att_map["meteorological"].length > 0){
		atts = atts.concat(att_map['meteorological']);
	}
	if (att_map["target"].length > 0){
		atts = atts.concat(att_map['target']);
	}
	atts.push("taxa_inf_m5");

	var call_data = "scenario=" + scenario + "&atts=" + atts.join(",");	
	console.log(call_data);
	
	$.ajax({
		type: 'GET',
		dataType: 'json',
		url: 'model/model_incidencia_atts_by_scenario.php',
		async: true,
		data: call_data,
		success: function(incidencia_table) {
			console.log(incidencia_table);
			show_atemporal_analysis(incidencia_table, atts);
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

// function get_incidencia_data(){
// 	// $("#go_search").button('loading');
// 	var call_data = 'scenario=' + $('#prediction_scenario_select').val();

// 	$.ajax({
// 		type: 'GET',
// 		dataType: 'json',
// 		url: 'model/model_incidencia_by_scenario.php',
// 		async: true,
// 		data: call_data,
// 		success: function(incidencia_table) {
// 			console.log(incidencia_table);
// 			view_prediction_temporal_analysis(incidencia_table);
// 		}
// 	});

// 	return false;
// }