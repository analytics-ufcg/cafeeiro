<?php

	$dsn = "CafeeiroDSN";

	# Turn on error reporting
    error_reporting(E_ERROR | E_WARNING | E_PARSE | E_NOTICE);

	# Queries
	$query_map = array(

		"get_incidencia_cidade_lavoura_carga" =>
			"SELECT distinct cidade, lavoura, carga
			FROM incidencia
			ORDER BY cidade;",

		"get_experiment_scenarios" =>
			"SELECT distinct scenario
			FROM experiment
			ORDER BY scenario;",

		// Used by model_incidencia_atts_with_conditions.php
		"get_incidencia_atts_with_conditions" =>
			"SELECT data as DateTime, [ATT_COLUMNS]
			FROM incidencia
			WHERE cidade = '[CITY]' AND lavoura = '[FARMING_COND]' AND carga = '[LOAD]';"
	);
?>