<?php 
    include 'global_model.php';

    # Read the GET parameters
    $scenario = $_GET['scenario'];
    $atts = $_GET['atts'];
    
    // $scenario = 'Varginha-alta-tx5';
    // $atts = 'taxa_inf_m5,lavoura,cidade,tmin_pi_pinf,smt_nhnur95_pinf,taxa_inf,incidencia';

    # Connect to the Database
    $conn = odbc_connect($dsn, '', '') or die ("ODBC CONNECTION ERROR!\n");

    # Prepare the query
    if ($scenario == 'Varginha-alta-tx5'){
        $query = $query_map['get_incidencia_atts_scenario_varginha_alta_tx5'];
    } elseif ($scenario == 'Tudo-alta-tx5') {
        $query = $query_map['get_incidencia_atts_scenario_tudo_alta_tx5'];
    } else{
        $query = '';
    }
    
    $query = str_replace('[ATT_COLUMNS]', $atts, $query);

    $incidencia_rows = array();

    if($query != ''){
        # Execute the query
        $resultset = odbc_prepare($conn, $query);
        $success = odbc_execute($resultset, array());

        while ($row = odbc_fetch_array($resultset)) {
            array_push($incidencia_rows, $row);
        }
    }

    // print_r($incidencia_rows);
    echo json_encode($incidencia_rows);
    
    # Close the connection
    odbc_close($conn);
?>