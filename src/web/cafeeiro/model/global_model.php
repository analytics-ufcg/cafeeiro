<?php

	$dsn = "CafeeiroDSN";

	# Turn on error reporting
    error_reporting(E_ERROR | E_WARNING | E_PARSE | E_NOTICE);

	# Queries
	$query_map = array(

		//Used by model_incidencia_by_scenario.php
		"get_scenario_varginha_alta_tx5" =>
			'SELECT cidade, carga, taxa_inf_m5
			FROM incidencia
			WHERE cidade = \'Varginha-antigo\' OR
      		      cidade = \'Varginha\' AND
      		      carga = \'alta\'',
      
      	"get_scenario_varginha_baixa_tx5" =>
			'SELECT cidade, carga, taxa_inf_m5
			FROM incidencia
			WHERE cidade = \'Varginha-antigo\' OR
      			  cidade = \'Varginha\' AND
      		  	  carga = \'baixa\'',
      
      	"get_scenario_varginha_alta_tx10" =>
			'SELECT cidade, carga, taxa_inf_m10
			FROM incidencia
			WHERE cidade = \'Varginha-antigo\' OR
      			  cidade = \'Varginha\' AND
      			  carga = \'alta\'',
      
      	"get_scenario_tudo_alta_tx5" =>
			'SELECT cidade, carga, taxa_inf_m5
			FROM incidencia
			WHERE carga = \'alta\'',

		"get_scenario_tudo_baixa_tx5" =>
			'SELECT cidade, carga, taxa_inf_m5
			FROM incidencia
			WHERE carga = \'baixa\'',

		"get_scenario_tudo_baixa_tx10" =>
			'SELECT cidade, carga, taxa_inf_m10
			FROM incidencia
			WHERE carga = \'alta\''
	);
?>