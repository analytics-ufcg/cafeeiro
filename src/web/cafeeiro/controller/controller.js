/*
	MAIN CONTROLLER METHOD
*/
function main_controller(){

	/*
		TAB SEARCH
	*/
	$("#prediction_scenario_select").change(function(e){
		console.log("teste");
		// Avoid refreshing the page
		run_search();
		
	});
}
function run_search(){
	// $("#go_search").button('loading');
	var call_data = 'scenario=' + $('#prediction_scenario_select').val();
	console.log(call_data);

	$.ajax({
		type: 'GET',
		dataType: 'json',
		url: 'model/model_incidencia_by_scenario.php',
		async: true,
		data: call_data,
		success: function(response) {
			// $("#go_search").button('reset');
			console.log(response);
			console.log("teste");
		}
	});
	return false;
}