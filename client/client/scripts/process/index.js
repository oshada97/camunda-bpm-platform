'use strict';
if (typeof define !== 'function') { var define = require('amdefine')(module); }
/* jshint unused: false */
define([
           'angular', 'angular-bootstrap',
           'camunda-tasklist-ui/api',
           'text!camunda-tasklist-ui/process/start.html'
], function(angular) {

  var processModule = angular.module('cam.tasklist.process', [
    'cam.tasklist.client',
    'ui.bootstrap'
  ]);



  processModule.controller('processStartModalFormCtrl', [
          '$scope', '$q', 'camAPI', 'camTasklistNotifier',
  function($scope,   $q,   camAPI,   camTasklistNotifier) {

    var ProcessDefinition = camAPI.resource('process-definition');

    var emptyVariable = {
      name:   '',
      value:  '',
      type:   ''
    };


    // http://docs.camunda.org/latest/api-references/rest/#process-definition-start-process-instance-method
    // Valid variable values are Boolean, Number, String and Date values.
    // NOTE: Actually... forget the docs...
    var variableTypes = {
      'Boolean':  'checkbox',
      'Integer':  'text',
      'Double':   'text',
      'Long':     'text',
      'Short':    'text',
      'String':   'text',
      'Date':     'datetime'
    };

    function close(result) {
      var isFunction = angular.isFunction($scope.$close);

      var cb =  isFunction ?
                $scope.$close :
                angular.noop;

      cb(result);
    }

    function loadError(err) {
      $scope.loadingProcesses = false;
    }

    // used by the pagination directive
    $scope.currentPage = 1;

    $scope.itemsPerPage = 25;

    $scope.totalProcesses = 0;

    $scope.processes = [];

    $scope.variables = [];

    $scope.variableTypes = variableTypes;

    $scope.loadingProcesses = false;

    $scope.close = close;


    $scope.selected = function($item, $model, $label) {
      $scope.startingProcess = $item;
    };


    $scope.lookupProcess = function(val) {
      var deferred = $q.defer();

      if (val.length > 2) {
        $scope.loadingProcesses = true;

        ProcessDefinition.list({
          nameLike: '%'+ val +'%'
        }, function(err, res) {
          $scope.loadingProcesses = false;
          if (err) {
            return deferred.reject(err);
          }
          deferred.resolve(res);
        });
      }
      else {
        deferred.resolve($scope.processes);
      }

      return deferred.promise;
    };


    $scope.showList = function() {
      $scope.startingProcess = null;
    };


    $scope.loadProcesses = function() {
      $scope.loadingProcesses = true;
      var where = {};

      // I found that in the REST API documentation,
      // I supposed it was aimed to be used,
      // but using it lead to empty results
      // where.startableBy = camStorage.get('user').id;

      where.maxResults = where.maxResults || $scope.itemsPerPage;

      ProcessDefinition.list(where, function(err, res) {
        $scope.loadingProcesses = false;
        if (err) {
          camTasklistNotifier.add(err);
          throw err;
        }
        $scope.totalProcesses = res.count;


        $scope.processes = res.items.sort(function(a, b) {
          var aName = (a.name || a.key).toLowerCase();
          var bName = (b.name || b.key).toLowerCase();
          if (aName < bName)
             return -1;
          if (aName > bName)
            return 1;
          return 0;
        });
        // $scope.$apply(function() {
        // });
      });
    };
    $scope.loadProcesses();


    $scope.getStartForm = function(startingProcess) {
      $scope.startingProcess = startingProcess;
      $scope.variables = [];
      $scope.addVariable();
    };


    $scope.addVariable = function() {
      $scope.variables.push(angular.copy(emptyVariable));
    };
    $scope.addVariable();


    $scope.removeVariable = function(delta) {
      var vars = [];

      angular.forEach($scope.variables, function(variable, d) {
        if (d != delta) {
          vars.push(variable);
        }
      });

      $scope.variables = vars;
    };


    $scope.submitForm = function(htmlForm) {
      if (!$scope.startingProcess || !$scope.startingProcess.key) {
        return false;
      }

      var vars = {};

      angular.forEach($scope.variables, function(val) {
        if (val.name[0] !== '$') {
          vars[val.name] = {type: val.type, value: val.value};
        }
      });

      ProcessDefinition.submit({
        key: $scope.startingProcess.key,
        variables: vars
      }, function(err, res) {
        if (err) {
          camTasklistNotifier.add(err);
          throw err;
        }

        camTasklistNotifier.add({
          type: 'success',
          text: 'The process has been started.'
        });
        close(res);
      });
      // camAPI.start($scope.startingProcess.key, {
      //   data: {
      //     variables: vars
      //   }
      // }).then(function(result) {
      //   camTasklistNotifier.add({
      //     type: 'success',
      //     text: 'The process has been started.'
      //   });
      //   close(result);
      // }, function(err) {
      //   camTasklistNotifier.add(err);
      // });
    };
  }]);


  processModule.controller('processStartCtrl', [
          '$modal', '$scope',
  function($modal,   $scope) {
    $scope.openProcessStartModal = function() {
      $modal.open({
        size: 'lg',
        controller: 'processStartModalFormCtrl',
        template: require('text!camunda-tasklist-ui/process/start.html')
      });
    };
  }]);

  return processModule;
});
