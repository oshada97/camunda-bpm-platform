define([
  'text!./cam-tasklist-filter-modal-form-variable.html'
], function(
  template
) {
  'use strict';

  var copy = angular.copy;

  return [function() {

    return {

      restrict: 'EAC',
      require: '^camTasklistFilterModalForm',
      scope: {
        filter: '=',
        accesses: '='
      },

      template: template,

      link: function ($scope, $element, attrs, parentCtrl) {

        var emptyVariable = {
          name: '',
          label: ''
        };
        
        $scope.variables = $scope.filter.properties.variables = $scope.filter.properties.variables || [];

        // register handler to show or hide the accordion hint /////////////////

        var showHintProvider = function () {
          for (var i = 0, nestedForm; !!(nestedForm = nestedForms[i]); i++) {
            var variableName = nestedForm.variableName;
            var variableLabel = nestedForm.variableLabel;

            if (variableName.$dirty && variableName.$invalid) {
              return true;
            }

            if (variableLabel.$dirty && variableLabel.$invalid) {
              return true;
            }
          }

          return false;
        };

        parentCtrl.registerHintProvider('filterVariableForm', showHintProvider);

        // handles each nested form //////////////////////////////////////////////

        var nestedForms = [];
        $scope.addForm = function (_form) {
          nestedForms.push(_form);
        };

        // variables interaction /////////////////////////////////////////////////

        $scope.addVariable = function() {
          var _emptyVariable = copy(emptyVariable);
          $scope.variables.push(_emptyVariable);
        };

        $scope.removeVariable = function(delta) {
          $scope.filter.properties.variables = $scope.variables = parentCtrl.removeArrayItem($scope.variables, delta);
          nestedForms = parentCtrl.removeArrayItem(nestedForms, delta);
        };

      }

    };

  }];

});
