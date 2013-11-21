<?php

    # Read the GET parameters
    $scenario = $_GET['scenario'];
    $att_methods = $_GET['att_methods'];
    $metrics = $_GET['metrics'];
    
    // $scenario  = 'Varginha-alta-tx5';
    // $att_methods  = 'Subjetivo - Modelagem 1,Subjetivo - Modelagem 2';
    // $metrics  = 'Acurácia,AUC';

    # Run the R script!
    exec("Rscript model_experiment_compare_models.R '$scenario' '$att_methods' '$metrics'", $output, $ret);
    echo json_encode($output);

    # Send the 
    // echo json_encode($output);
    // echo str_replace("\n", " ", $output);
    // echo json_encode($output);

    // var_dump($output);

    // echo json_encode($output);
?>
