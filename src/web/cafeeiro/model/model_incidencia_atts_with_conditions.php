<?php 
    include 'global_model.php';

    # Read the GET parameters
    $city = $_GET['city'];
    $farming_cond = $_GET['farming_cond'];
    $load = $_GET['load'];
    $target_att = $_GET['target_att'];
    $atts = $_GET['atts'];
    
    // $city = 'Varginha';
    // $farming_cond = 'larga';
    // $load = 'alta';
    // $target_att = 'taxa_inf_m5';
    // $atts = 'taxa_inf_m5,lavoura,cidade,tmin_pi_pinf,smt_nhnur95_pinf,taxa_inf,incidencia';

    $all_incidencia_atts = "$target_att,$atts";

    # Connect to the Database
    $conn = odbc_connect($dsn, '', '') or die ("ODBC CONNECTION ERROR!\n");

    # Prepare the query
    $query = $query_map['get_incidencia_atts_with_conditions'];
    
    $query = str_replace('[LOAD]', $load, 
                str_replace('[FARMING_COND]', $farming_cond, 
                    str_replace('[CITY]', $city, 
                        str_replace('[ATT_COLUMNS]', $all_incidencia_atts, $query))));

    # Execute the query
    $resultset = odbc_prepare($conn, $query);
    $success = odbc_execute($resultset, array());

    $incidencia_rows = array();
    while ($row = odbc_fetch_array($resultset)) {

        # Remove the time from DateTime
        $new_date = split(' ', $row['DateTime']);
        $row['DateTime'] = $new_date[0];
        
        # Cast all the other attributes to float
        $atts_to_float = split(',', $all_incidencia_atts);
        foreach ($atts_to_float as $key => $value) {            
            $row[$value] = (float) $row[$value];
        }

        array_push($incidencia_rows, $row);
    }

    // print_r($incidencia_rows);
    echo json_encode($incidencia_rows);
    
    # Close the connection
    odbc_close($conn);
?>