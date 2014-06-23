'use strict';
if (typeof define !== 'function') { var define = require('amdefine')(module); }
/* jshint unused: false */
define([
           'angular', 'moment',
           'camunda-tasklist-ui/utils',
           'camunda-tasklist-ui/api',
           'camunda-tasklist-ui/task/data',
           'camunda-tasklist-ui/form/data',
           'angular-bootstrap',
           'text!camunda-tasklist-ui/task/task.html',
           'text!camunda-tasklist-ui/task/form.html',
           'text!camunda-tasklist-ui/task/history.html'
], function(angular,   moment) {
  var taskModule = angular.module('cam.tasklist.task', [
    'cam.tasklist.utils',
    'cam.tasklist.client',
    'cam.tasklist.task.data',
    'cam.tasklist.form.data',
    'ui.bootstrap',
    'cam.form',
    'angularMoment'
  ]);

  /**
   * @module cam.tasklist.task
   */

  /**
   * @memberof cam.tasklist
   */

  taskModule.directive('camTasklistTask', [
          '$modal', '$rootScope', 'camUID',
  function($modal,   $rootScope,   camUID) {
    $rootScope.batchActions = {};
    $rootScope.batchActions.selected = [];

    return {
      link: function(scope, element) {
        scope.task = scope.task || $rootScope.currentTask;

        scope.elUID = camUID();

        element.find('.nav li').eq(0).addClass('active');
        element.find('.tab-pane').eq(0).addClass('active');

        $rootScope.$on('tasklist.task.current', function() {
          scope.task = $rootScope.currentTask;
        });
      },
      template: require('text!camunda-tasklist-ui/task/task.html')
    };
  }]);

  // should be moved to the form module...
  taskModule.directive('camTasklistTaskForm', [
          'camTaskFormData', '$rootScope', 'camUID',
  function(camTaskFormData,   $rootScope,   camUID) {
    return {
      link: function(scope, element) {
        scope.elUID = camUID();

        scope.labelsWidth = 3;
        scope.fieldsWidth = 12 - scope.labelsWidth;

        $rootScope.$on('tasklist.task.current', function() {
          scope.fields = camTaskFormData();
        });
      },
      template: require('text!camunda-tasklist-ui/task/form.html')
    };
  }]);

  taskModule.directive('camTasklistTaskHistory', [
          'camTaskHistoryData', '$rootScope', '$timeout',
  function(camTaskHistoryData,   $rootScope,   $timeout) {
    return {
      link: function(scope, element) {
        scope.history = [];
        scope.days = [];

        $rootScope.$on('tasklist.task.current', function() {
          scope.history = camTaskHistoryData(null, null);
          scope.now = new Date();
          var days = {};
          angular.forEach(scope.history, function(event) {
            var mom = moment(event.timestamp, 'X');
            var date = mom.format('DD-MMMM-YYYY');
            var time = mom.format('HH:mm');
            var parts = date.split('-');
            days[date] = days[date] || {
              date: {
                day: parts[0],
                month: parts[1],
                year: parts[2]
              },
              events: {}
            };
            days[date].events[time] = days[date].events[time] || [];
            days[date].events[time].push(event);
          });
          scope.days = days;
        });
      },
      template: require('text!camunda-tasklist-ui/task/history.html')
    };
  }]);

  return taskModule;
});
