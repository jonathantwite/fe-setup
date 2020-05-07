import {doCalculation} from '../services/calculatorService.mjs';
import '../../node_modules/jquery/dist/jquery.js';
import '../../node_modules/bootstrap/dist/js/bootstrap.js';

function runCalculation(){
    const v1 = Number($('#input1').val());
    const v2 = Number($('#input2').val());
    const v3 = Number($('#input3').val());
    
    $('#answer').text((v1 && v2 && v3) ? doCalculation(v1,v2,v3) : '');
}

$(function(){
    $('#input1').change(runCalculation);   
    $('#input2').change(runCalculation);   
    $('#input3').change(runCalculation);   
});
