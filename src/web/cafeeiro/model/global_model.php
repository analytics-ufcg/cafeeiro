<?php

	$dsn = "CafeeiroDSN";

	# Turn on error reporting
    error_reporting(E_ERROR | E_WARNING | E_PARSE | E_NOTICE);

	# Queries
	$query_map = array(

		//Used by Cenario Varginha-alta-tx5
		"get_scenario_varginha_alta_tx5" =>
			'SELECT cidade, carga, taxa_inf_m5
			FROM incidencia
			WHERE cidade = \'Varginha-antigo\' OR
      		      cidade = \'Varginha\' AND
      		      carga = \'alta\'',
      
		//Used by Cenario Varginha-baixa-tx5
      	"get_scenario_varginha_baixa_tx5" =>
			'SELECT cidade, carga, taxa_inf_m5
			FROM incidencia
			WHERE cidade = \'Varginha-antigo\' OR
      			  cidade = \'Varginha\' AND
      		  	  carga = \'baixa\'',
      
		//Used by Cenario Varginha-alta-tx10
      	"get_scenario_varginha_alta_tx10" =>
			'SELECT cidade, carga, taxa_inf_m10
			FROM incidencia
			WHERE cidade = \'Varginha-antigo\' OR
      			  cidade = \'Varginha\' AND
      			  carga = \'alta\'',
      
		//Used by Cenario Tudo-alta-tx5
      	"get_scenario_tudo_alta_tx5" =>
			'SELECT cidade, carga, taxa_inf_m5
			FROM incidencia
			WHERE carga = \'alta\'',

		//Used by Cenario Tudo-baixa-tx5
		"get_scenario_tudo_baixa_tx5" =>
			'SELECT cidade, carga, taxa_inf_m5
			FROM incidencia
			WHERE carga = \'baixa\'',

		//Used by Cenario Tudo-baixa-tx10
		"get_scenario_tudo_baixa_tx10" =>
			'SELECT cidade, carga, taxa_inf_m10
			FROM incidencia
			WHERE carga = \'alta\''
	);
?>