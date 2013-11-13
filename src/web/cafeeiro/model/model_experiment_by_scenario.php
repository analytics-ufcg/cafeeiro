<?php 
    include 'global_model.php';

    # Read the GET parameters
    $scenario = $_GET['scenario'];

    #$scenario  = 'Varginha-alta-tx5';

    # Connect to the Database
    $conn = odbc_connect($dsn,'','') or die ("CONNECTION ERROR\n");

    # Prepare the query
    if ($scenario == 'Varginha-alta-tx5'){
        $query = $query_map['get_prediction_varginha_alta_tx5'];
    } elseif ($scenario == 'Tudo-alta-tx5') {
        $query = $query_map['get_prediction_tudo_alta_tx5'];
    } else{
        $query = '';
    }

    $prediction_rows = array();

    if($query != ''){
        # Execute the query
        $resultset = odbc_prepare($conn, $query);
        $success = odbc_execute($resultset, array());

        while ($row = odbc_fetch_array($resultset)) {
            array_push($prediction_rows, $row);
        }
    }

    print_r(array($prediction_rows));
    echo json_encode(array($prediction_rows));
    
    # Close the connection
    odbc_close($conn);
?>