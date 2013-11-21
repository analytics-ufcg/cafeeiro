/*
	MAIN CONTROLLER METHOD
*/
function main_controller(){

	$('.selectpicker').selectpicker();

	$("#prediction_scenario_select").change(function(e){
		// Avoid refreshing the page
		get_incidencia_data();
	});

	$("#model_comparison_form").submit(function(e){
		// Avoid refreshing the page
		e.preventDefault(); 
		compare_models_with_ic();
	});

}

function get_incidencia_data(){
	// $("#go_search").button('loading');
	var call_data = 'scenario=' + $('#prediction_scenario_select').val();

	$.ajax({
		type: 'GET',
		dataType: 'json',
		url: 'model/model_incidencia_by_scenario.php',
		async: true,
		data: call_data,
		success: function(incidencia_table) {
			console.log(incidencia_table);
			view_prediction_temporal_analysis(incidencia_table);
		}
	});

	return false;
}

function compare_models_with_ic(){
 	// $("#model_comparison_submit_btn").button('loading');
	
	var call_data = 'scenario=' + $('#prediction_scenario_select').val() + 
					'&att_methods=' + $("#att_list").val().join() + 
					'&metrics=' + $("#metric_list").val().join();

	console.log(call_data);

	$.ajax({
		type: 'GET',
		dataType: 'json',
		url: 'model/model_experiment_compare_models.php',
		async: true,
		data: call_data,
		success: function(ci_data_text) {
			// We need to parse it again
			var ci_data = $.parseJSON(ci_data_text.join(""));

			view_prediction_model_comparison(ci_data);
		}
	});
}