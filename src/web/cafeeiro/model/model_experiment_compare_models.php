<?php 
    include 'global_model.php';

    # Read the GET parameters
    // $scenario = $_GET['scenario'];
    // $att_methods = $_GET['att_methods'];
    // $metrics = $_GET['metrics'];

    $scenario  = 'Varginha-alta-tx5';
    $att_methods  = 'Subjetivo - Modelagem 1,Subjetivo - Modelagem 2';
    $metrics  = 'Acurácia,AUC';

    # Prepare the parameters:
    # Attribute Methods
    $att_methods = split(',', str_replace(" ", "", $att_methods));

    # Metrics
    $metrics_to_english = array('Acurácia' => 'accuracy', 'Erro' => 'Error', 'Sensitividade' => 'Sensitivity', 
        'Especificidade' => 'Specificity', 'FP-Rate' => 'fprate', 'TP-Rate' => 'tprate', 'AUC' => 'AUC');
    $metrics = split(',', $metrics);

    # Prepare the Query
    $metrics_in_query = '';
    foreach ($metrics as $metric_port) {
        $metrics_in_query .= $metrics_to_english[$metric_port] . ', ';
    }
    $metrics_in_query = substr($metrics_in_query, 0, -2);

    $att_methods_in_query = '';
    foreach ($att_methods as $att_meth) {
        $att_methods_in_query .= 'attribute_method = \'' . $att_meth . '\'' . ' OR ';
    }
    $att_methods_in_query = substr($att_methods_in_query, 0, -4);
    
    $query = str_replace('[ATT_METHODS]', $att_methods_in_query, 
                str_replace('[METRICS]', $metrics_in_query, $query_map['get_experiment_by_scenario_att_method']));

    # Call R (passing the SQL query as input)



    // # Connect to the Database
    // $conn = odbc_connect($dsn,'','') or die ("ODBC CONNECTION ERROR\n");

    // $prediction_rows = array();
    
    // if ($scenario == 'Varginha-alta-tx5' || $scenario == 'Tudo-alta-tx5') {
    //     # Prepare the query
    //     $query = str_replace("[SCENARIO]", $scenario, $query_map['get_prediction_by_scenario']);

    //     # Execute the query
    //     $resultset = odbc_prepare($conn, $query);
    //     $success = odbc_execute($resultset, array());

    //     while ($row = odbc_fetch_array($resultset)) {
    //         array_push($prediction_rows, $row);
    //     }
    // } 

    // // print_r(array($prediction_rows));
    // echo json_encode($prediction_rows);
    
    // # Close the connection
    // odbc_close($conn);
?>