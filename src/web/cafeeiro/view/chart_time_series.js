
'use strict';

$(function () {

    //Dados das series
    //<script src="./sample_data2.js"></script>

    requirejs.config({
        "baseUrl": "./",
        "paths": {
            "app": "./js/",
            'moment': 'http://cdnjs.cloudflare.com/ajax/libs/moment.js/2.2.1/moment.min',
            'underscore': 'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min'                    
        }
    });




    require(['app/d3.chart'], function (d3Chart) {
        d3Chart.init({ container: '#temporal_pane', xDim: 'DateTime' });
      
        d3Chart.addGraph({ id: 'Incidência', type: 'analog', name: 'Incidência', dataId: 513, yVal: ['incidencia'], data: incidencia_data });


        console.log(incidencia_atts[0]);
        for (var i in incidencia_atts){
            console.log(incidencia_atts[i]);
            d3Chart.addGraph({ id: incidencia_data[i], type: 'analog', name: incidencia_data[i], dataId: 513, yVal: [incidencia_data[i]], data: incidencia_data});
        };        

        //d3Chart.addGraph({ id: 'tmin_pinf', type: 'analog', name: 'tmin_pinf', dataId: 513, yVal: ['tmin_pinf'], data: incidencia_data});
        //d3Chart.addGraph({ id: 'tmax_pinf', type: 'analog', name: 'tmax_pinf', dataId: 513, yVal: ['tmax_pinf'], data: incidencia_data });
        //d3Chart.addGraph({ id: 'taxa_inf_m5', type: 'analog', name: 'taxa_inf_m5', dataId: 513, yVal: ['taxa_inf_m5'], data: incidencia_data });

        d3Chart.render();                              

        setTimeout(function () {  
            d3Chart.reorderGraph('Accel', 'up');
            
            //window.setTimeout(function () {
            //    d3Chart.removeGraph('RPM');
            //}, 2000);
            
        }, 3000);


    });

});