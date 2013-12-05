<?php 
    include 'global_model.php';

    # Read the GET parameters
    $city = $_GET['city'];
    $farming_cond = $_GET['farming_cond'];
    $atts = $_GET['atts'];
    
    // $cities = 'Varginha,Varginha-antigo';
    // $farming_cond = 'larga,adensada';
    // $atts = 'taxa_inf_m5,lavoura,cidade,tmin_pi_pinf,smt_nhnur95_pinf,taxa_inf,incidencia';

    # Connect to the Database
    $conn = odbc_connect($dsn, '', '') or die ("ODBC CONNECTION ERROR!\n");

    # Prepare the query
    $query = $query_map['get_incidencia_atts_with_conditions'];
    
    $query = str_replace('[FARMING_COND]', $farming_cond, 
                str_replace('[CITY]', $city, 
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