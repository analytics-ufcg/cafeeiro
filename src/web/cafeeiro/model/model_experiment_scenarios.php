<?php 
    include 'global_model.php';

    # Read the GET parameters
    # No parameters

    # Connect to the Database
    $conn = odbc_connect($dsn, '', '') or die ("ODBC CONNECTION ERROR!\n");

    # Prepare the query
    $query = $query_map['get_experiment_scenarios'];

    # Execute the query
    $resultset = odbc_prepare($conn, $query);
    $success = odbc_execute($resultset, array());

    $scenarios = array();
    while ($row = odbc_fetch_array($resultset)) {
        array_push($scenarios, $row['scenario']);
    }

    // print_r($scenarios);
    echo json_encode($scenarios);
    
    # Close the connection
    odbc_close($conn);
?>