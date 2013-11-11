<?php 
    include 'global_model.php';

    # Read the GET parameters
    // $scenario = $_GET['scenario'];

    $scenario  = 'Varginha_alta_tx10';

    # Connect to the Database
    $conn = odbc_connect($dsn,'','') or die ("CONNECTION ERROR\n");

    # Prepare the query
    if ($scenario == 'Varginha_alta_tx5'){
        $query = $query_map['get_scenario_varginha_alta_tx5'];
    } elseif ($scenario == 'Varginha_baixa_tx5') {
        $query = $query_map['get_scenario_varginha_baixa_tx5'];
    } elseif ($scenario == 'Varginha_alta_tx10') {
        $query = $query_map['get_scenario_varginha_alta_tx10'];
    } elseif ($scenario == 'Tudo_alta_tx5') {
        $query = $query_map['get_scenario_tudo_alta_tx5'];
    } elseif ($scenario == 'Tudo_baixa_tx5') {
        $query = $query_map['get_scenario_tudo_baixa_tx5'];
    } elseif ($scenario == 'Tudo_baixa_tx10') {
        $query = $query_map['get_scenario_tudo_baixa_tx10'];
    } else{
        $query = '';
    }

    $incidencia_rows = array();

    if($query != ''){
        # Execute the query
        $resultset = odbc_prepare($conn, $query);
        $success = odbc_execute($resultset, array());

        while ($row = odbc_fetch_array($resultset)) {
            array_push($incidencia_rows, $row);
        }
    }

    print_r(array($incidencia_rows));
    // echo json_encode(array($incidencia_rows));
    
    # Close the connection
    odbc_close($conn);
?>

