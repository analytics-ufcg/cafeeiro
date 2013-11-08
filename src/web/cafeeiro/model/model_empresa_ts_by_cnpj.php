<?php 
    include 'global_model.php';

    # Read the GET parameters
    $scenario = $_GET['scenario'];

    # Connect to the Database
    $conn = odbc_connect($dsn,'','') or die ("CONNECTION ERROR\n");

    # ----------------------------------------------------------------------------------------
    # QUERY 1: Get the ISIN with the largest acao
    # ----------------------------------------------------------------------------------------

    # Prepare the query
    if ($scenario == 'Varginha_alta_tx5'){
        $query = $query_map['get_scenario_varginha_alta_tx5']
    }
        if ($scenario == 'Varginha_baixa_tx5'){
        $query = $query_map['get_scenario_varginha_baixa_tx5']
    }
        if ($scenario == 'Varginha_alta_tx10'){
        $query = $query_map['get_scenario_varginha_alta_tx10']
    }
        if ($scenario == 'Tudo_alta_tx5'){
        $query = $query_map['get_scenario_tudo_alta_tx5']
    }
        if ($scenario == 'Tudo_baixa_tx5'){
        $query = $query_map['get_scenario_tudo_baixa_tx5']
    }
        if ($scenario == 'Tudo_baixa_tx10'){
        $query = $query_map['get_scenario_tudo_baixa_tx10']
    }

    # Execute the query
    $resultset = odbc_prepare($conn, $query);
    $success = odbc_execute($resultset, array());

    $isin_row = array();
    while ($row = odbc_fetch_array($resultset)) {
        array_push($isin_row, $row);
    }
    
    echo json_encode(array($list_response, $selected_isin));
    
    # Close the connection
    odbc_close($conn);
?>

