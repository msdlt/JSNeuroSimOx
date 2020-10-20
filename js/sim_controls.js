/*jslint browser: true */
var simcontrols = (function () {
    "use strict";

    function defaultValidator(param, value) {
        var units = param.units === undefined ? '' : ' ' + param.units;

        if (!isFinite(value)) {
            return { 
                value: param.defaultVal, 
                error: 'Unrecognized entry; using default of '
                    + String(param.defaultVal) + units
            };
        } else if (+value < param.minVal) {
            return { 
                value: param.minVal, 
                error: 'Value too low; using minimum value of '
                    + String(param.minVal) + units
            };
        } else if (+value > param.maxVal) {
            return { 
                value: param.maxVal, 
                error: 'Value too high; using maximum value of '
                    + String(param.maxVal) + units
            };
        } else {
            return { value: +value, error: '' };
        }
    }

    function controls(element, params, layout) {
        var i, section, heading, paramForm, j, paramName, paramRow, 
            paramLabel, paramInputCell, paramInputGroup, paramUnitsWrapper, paramUnits,
            values, errorLabels = {}, textBoxes = {}, checkBoxes = {};

        // store the current value of each of the parameters
        values = {};
        for (i in params) {
            if (params.hasOwnProperty(i)) {                
                if (params[i].hasOwnProperty('checked')) {
                    if (params[i].checked) {
                        values[i] = params[i].checkedVal;
                    } else {
                        values[i] = params[i].uncheckedVal;
                    }
                } else {
                    values[i] = params[i].defaultVal;
                }
            }
        }

        function textBoxChangeHandler(paramName) {
            return function () {
                var result = defaultValidator(params[paramName], 
                        textBoxes[paramName].value);
                values[paramName] = result.value;
                errorLabels[paramName].innerHTML = result.error;
            };
        }
        
        function checkBoxChangeHandler(paramName) {
            return function () {
                if (checkBoxes[paramName].checked) {
                    values[paramName] = params[paramName].checkedVal;
                } else {
                    values[paramName] = params[paramName].uncheckedVal;
                }
            };
        }
        
        // create the controls
        for (i = 0; i < layout.length; i += 1) {
            section = document.createElement('div');
            section.className = 'simparamsection';
            element.appendChild(section);

            heading = document.createElement('h4');
            heading.innerHTML = layout[i][0];
            heading.className = 'simparamheading';
            section.appendChild(heading);

            //paramTable = document.createElement('table');
            paramForm = document.createElement('form');
            section.appendChild(paramForm);

            for (j = 0; j < layout[i][1].length; j += 1) {
                paramName = layout[i][1][j];

                //paramRow = document.createElement('tr');
                paramRow = document.createElement('div');
                paramRow.classList.add('form-group');
                paramRow.classList.add('row');

                paramForm.appendChild(paramRow);
                //default to not hiding anything unless advanced proerty set in params
                var advancedValue = false;
                if(params[paramName].hasOwnProperty('advanced')) {
                    advancedValue = params[paramName].advanced;    
                } 
                paramRow.setAttribute('data-advanced', advancedValue);
                if(advancedValue) paramRow.classList.add('advanced');
                
                                
                //paramLabel = document.createElement('td');
                paramLabel = document.createElement('label');
                paramLabel.classList.add('col-sm-6');
                paramLabel.classList.add('col-form-label');
                paramLabel.setAttribute('for', 'formControl'+ j);
                paramLabel.innerHTML = params[paramName].label;
                //paramLabel.className = 'simparamlabel';
                paramRow.appendChild(paramLabel);
                
                //paramInputCell = document.createElement('td');
                paramInputCell = document.createElement('div');
                paramInputCell.classList.add('col-sm-6');
                paramRow.appendChild(paramInputCell);

                paramInputGroup = document.createElement('div');
                paramInputGroup.classList.add('input-group');
                paramInputCell.appendChild(paramInputGroup);

                if (params[paramName].hasOwnProperty('checked')) {

                    checkBoxes[paramName] = document.createElement('input');
                    checkBoxes[paramName].type = 'checkbox';
                    checkBoxes[paramName].id = 'formControl'+ j;
                    checkBoxes[paramName].checked = params[paramName].checked;
                    checkBoxes[paramName].addEventListener('change',
                        checkBoxChangeHandler(paramName), false);
                    //checkBoxes[paramName].className = 'simparamcheck';
                    checkBoxes[paramName].className = 'form-control';
                    paramInputGroup.appendChild(checkBoxes[paramName]);

                } else {

                    textBoxes[paramName] = document.createElement('input');
                    textBoxes[paramName].value = params[paramName].defaultVal;
                    textBoxes[paramName].id = 'formControl'+ j;
                    textBoxes[paramName].addEventListener('change', 
                        textBoxChangeHandler(paramName), false);
                    //textBoxes[paramName].className = 'simparaminput';
                    textBoxes[paramName].className = 'form-control';
                    paramInputGroup.appendChild(textBoxes[paramName]);

                }

                
                if (params[paramName].units) {
                    paramUnitsWrapper = document.createElement('div');
                    paramUnitsWrapper.classList.add('input-group-append');
                    paramInputGroup.appendChild(paramUnitsWrapper);

                    //paramUnits = document.createElement('td');
                    paramUnits = document.createElement('span');
                    paramUnits.classList.add('input-group-text');
                    paramUnits.innerHTML = params[paramName].units;
                    //paramUnits.className = 'simparamunits';
                    paramUnitsWrapper.appendChild(paramUnits);
                }
                

                //errorLabels[paramName] = document.createElement('td');
                errorLabels[paramName] = document.createElement('span');
                errorLabels[paramName].className = 'simparamerror';
                paramUnitsWrapper.appendChild(errorLabels[paramName]);
            }
        }

        function triggerRead() {
            var i;

            for (i in textBoxes) {
                if (textBoxes.hasOwnProperty(i)) {                
                    textBoxChangeHandler(i)();
                }
            }

            for (i in checkBoxes) {
                if (checkBoxes.hasOwnProperty(i)) {                
                    checkBoxChangeHandler(i)();
                }
            }
        }

        return { 
            values: values,
            triggerRead: triggerRead
        };
    }

    return {
        controls: controls,
        defaultValidator: defaultValidator,
    };
}());

