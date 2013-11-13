<?php

	$dsn = "CafeeiroDSN";

	# Turn on error reporting
    error_reporting(E_ERROR | E_WARNING | E_PARSE | E_NOTICE);

	# Queries
	$query_map = array(

		//Used by: model_incidencia_by_scenario.php
		"get_scenario_varginha_alta_tx5" =>
			'SELECT dia, incidencia, taxa_inf_m5
			FROM incidencia
			WHERE cidade = \'Varginha-antigo\' OR
      			  cidade = \'Varginha\' AND
      			  carga = \'alta\';',
      
      	"get_scenario_tudo_alta_tx5" =>
			'SELECT dia, incidencia, taxa_inf_m5
			FROM incidencia
			WHERE carga = \'alta\';',

		//Used by: model_experiment_compare_models.php
		"get_experiment_by_scenario_att_method" =>
			'SELECT run, attribute_method, model, [METRICS]
			FROM experiment
			WHERE [ATT_METHODS];'


	);
?>