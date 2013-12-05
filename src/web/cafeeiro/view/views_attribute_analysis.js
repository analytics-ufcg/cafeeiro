function show_atts_atemporal_analysis(incidencia_table, att_names, target_att){
	if ($('#atts_analysis #central_bar #atemporal_pane').is(":visible") && att_names.length > 0){
		remove_parallel_coord();
		plot_parallel_coord(incidencia_table, att_names, target_att);		
	}
}