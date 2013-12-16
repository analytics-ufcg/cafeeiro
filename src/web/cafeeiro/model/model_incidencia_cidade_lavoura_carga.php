<?php 
    include 'global_model.php';

    # Read the GET parameters
    # No parameters

    # Connect to the Database
    $conn = odbc_connect($dsn, '', '') or die ("ODBC CONNECTION ERROR!\n");

    # Prepare the query
    $query = $query_map['get_incidencia_cidade_lavoura_carga'];

    # Execute the query
    $resultset = odbc_prepare($conn, $query);
    $success = odbc_execute($resultset, array());

    $cities_rows = array();
    while ($row = odbc_fetch_array($resultset)) {
        array_push($cities_rows, $row);
    }

    // print_r($cities_rows);
    echo json_encode($cities_rows);
    
    # Close the connection
    odbc_close($conn);
?>