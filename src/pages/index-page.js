import {doCalculation2} from '../services/calculatorService.mjs';
import 'jquery';
import 'bootstrap';

function runCalculation(){
    const v1 = Number($('#input1').val());
    const v2 = Number($('#input2').val());
    const v3 = Number($('#input3').val());
    
    $('#answer').text((v1 && v2 && v3) ? doCalculation2(v1,v2,v3) : '');
}

$(function(){
    $('#input1').change(runCalculation);   
    $('#input2').change(runCalculation);   
    $('#input3').change(runCalculation);   
});
