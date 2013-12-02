<?php 
    include 'global_model.php';

    # Read the GET parameters
    $cities = $_GET['cities'];
    $farming_cond = $_GET['farming_cond'];
    $atts = $_GET['atts'];
    
    // $cities = 'Varginha,Varginha-antigo';
    // $farming_cond = 'larga,adensada';
    // $atts = 'taxa_inf_m5,lavoura,cidade,tmin_pi_pinf,smt_nhnur95_pinf,taxa_inf,incidencia';

    # Connect to the Database
    $conn = odbc_connect($dsn, '', '') or die ("ODBC CONNECTION ERROR!\n");


    # Prepare the query
    $query = $query_map['get_incidencia_atts_with_conditions'];
    
    $city_clauses = array();
    foreach (split(',', $cities) as $city) {
        array_push($city_clauses, "cidade = '$city'");
    }

    $farming_clauses = array();
    foreach (split(',', $farming_cond) as $farm_cond) {
        array_push($farming_clauses, "lavoura = '$farm_cond'");
    }
    
    $query = str_replace('[FARMING_CONDITIONS]', join(" OR ", $farming_clauses), 
                str_replace('[CITY_CONDITIONS]', join(" OR ", $city_clauses), 
                    str_replace('[ATT_COLUMNS]', $atts, $query)));

    # Execute the query
    $resultset = odbc_prepare($conn, $query);
    $success = odbc_execute($resultset, array());

    $incidencia_rows = array();
    while ($row = odbc_fetch_array($resultset)) {
        array_push($incidencia_rows, $row);
    }

    // print_r($incidencia_rows);
    echo json_encode($incidencia_rows);
    
    # Close the connection
    odbc_close($conn);
?>