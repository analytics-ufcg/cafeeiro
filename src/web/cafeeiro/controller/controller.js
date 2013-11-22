/*
	MAIN CONTROLLER METHOD
*/
function main_controller(){

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
	
	scenario = $('#prediction_scenario_select').val();
	att_list = $("#att_list").val();
	metric_list = $("#metric_list").val();

	// Check the input parameters
	if (scenario != "Cenário" && att_list != null && metric_list != null){
	
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
				var ci_data = $.parseJSON(ci_data_text.join(""));

				view_prediction_model_comparison(ci_data);

				$("#model_comparison_submit_btn").button('reset');
			}
		});
	}
}