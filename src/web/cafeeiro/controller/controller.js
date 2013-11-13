/*
	MAIN CONTROLLER METHOD
*/
function main_controller(){

	$("#prediction_scenario_select").change(function(e){
		// Avoid refreshing the page
		get_prediction_data();
	});

	$('a[data-toggle="tab"]').on('shown', function (e) {
		e.target // activated tab
		e.relatedTarget // previous tab
	})
}
function get_prediction_data(){
	// $("#go_search").button('loading');
	var call_data = 'scenario=' + $('#prediction_scenario_select').val();
	console.log(call_data);

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

	$.ajax({
		type: 'GET',
		dataType: 'json',
		url: 'model/model_experiment_by_scenario.php',
		async: true,
		data: call_data,
		success: function(experiment_table) {
			console.log(experiment_table);
			view_prediction_model_comparison(experiment_table);
		}
	});

	return false;
}