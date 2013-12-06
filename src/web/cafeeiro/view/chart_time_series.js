
'use strict';

$(function () {

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
      //d3Chart.addGraph({ id: 'Speed', type: 'horizon', name: 'Speed', dataId: 512, yVal: ['Value'], data: speedData });
      //d3Chart.addGraph({ id: 'Imps', type: 'analog', name: 'RPM', dataId: 513, yVal: ['Value'], data: imps1 });
      //d3Chart.addGraph({ id: 'Clicks', type: 'analog', name: 'RPM2', dataId: 513, yVal: ['Value'], data: imps2 });
      //d3Chart.addGraph({ id: 'CTR', type: 'analog', name: 'CTR', dataId: 513, yVal: ['Value'], data: CTR });
      //d3Chart.addGraph({ id: 'DI', type: 'digital', name: 'Digital Input', dataId: 522, data: diData });
        d3Chart.addGraph({ id: 'chuva', type: 'analog', name: 'grafico da chuva', dataId: 513, yVal: ['dchuv_pinf'], data: chuva });
        d3Chart.addGraph({ id: 'chuvinha', type: 'analog', name: 'grafico chuvinha', dataId: 513, yVal: ['dchuv_pinf'], data: chuva });
      //d3Chart.addGraph({ id: 'Accel', type: 'analog', name: 'Accel', dataId: 522, yVal: ['X', 'Y', 'Z'], data: accelData });
        d3Chart.render();                              

        setTimeout(function () {  
            d3Chart.reorderGraph('Accel', 'up');
            
            //window.setTimeout(function () {
            //    d3Chart.removeGraph('RPM');
            //}, 2000);
            
        }, 3000);


    });

});