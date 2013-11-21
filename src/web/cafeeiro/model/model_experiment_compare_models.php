<?php

    # Read the GET parameters
    $scenario = $_GET['scenario'];
    $att_methods = $_GET['att_methods'];
    $metrics = $_GET['metrics'];
    
    // $scenario  = 'Varginha-alta-tx5';
    // $att_methods  = 'Subjetivo - Modelagem 1,Subjetivo - Modelagem 2';
    // $metrics  = 'Acurácia,AUC';

    # Run the R script!
    exec("echo '$scenario' > ../img/b.out");
    exec("Rscript model_experiment_compare_models.R '$scenario' '$att_methods' '$metrics'");

    echo json_encode(array());
?>
