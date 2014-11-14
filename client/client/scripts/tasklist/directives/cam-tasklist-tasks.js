define([
  'angular',
  'moment',
  'text!./cam-tasklist-tasks.html'
], function(
  angular,
  moment,
  template
) {
  'use strict';
  var $ = angular.element;

  return [function(){

    return {

      restrict: 'EAC',
      scope: {
        tasklistData: '='
      },

      template: template,

      controller: [
        '$scope',
        '$location',
        'search',
        '$timeout',
        '$element',
      function(
        $scope,
        $location,
        search,
        $timeout,
        $element
      ) {

        function updateSilently(params) {
          search.updateSilently(params);
        }

        var forceFocus = false;

        $scope.pageNum = 1;
        $scope.pageSize = null;
        $scope.totalItems = 0;
        $scope.now = (new Date()).toJSON();

        $scope.filterProperties = null;

        var tasksData = $scope.tasklistData.newChild($scope);

        $scope.query = {};

        /**
         * observe the list of tasks
         */
        $scope.state = tasksData.observe('taskList', function (taskList) {
          $scope.totalItems = taskList.count;
          $scope.tasks = taskList._embedded.task;
          if(forceFocus) {
            $scope.focus(null, $scope.tasks[forceFocus === 'first' ? 0 : $scope.pageSize - 1]);
            $timeout(function(){
              $element
                .find('div[ng-keydown]')
                .trigger('focus')
                  .find('li.active')[0]
                  .scrollIntoView(false);
            }, 0);
            forceFocus = false;
          }
        });

        /**
         * observe the task list query
         */
        tasksData.observe('taskListQuery', function(taskListQuery) {
          if (taskListQuery) {
            // parse pagination properties from query
            $scope.query = angular.copy(taskListQuery);
            $scope.pageSize = $scope.query.maxResults;
            // Sachbearbeiter starts counting at '1'
            $scope.pageNum = ($scope.query.firstResult / $scope.pageSize) + 1;
          }
        });

        tasksData.observe('taskId', function(taskId) {
          $scope.currentTaskId = taskId.taskId;
        });

        /**
         * Observes the properties of the current filter.
         * Used to retrieve information about variables displayed on a task.
         */
        tasksData.observe(['currentFilter', function(currentFilter) {
          if (currentFilter) {
            $scope.filterProperties = currentFilter !== null ? currentFilter.properties : null;
          }
        }]);

        $scope.focus = function ($event, task) {
          if ($event) {
            $event.preventDefault();
          }

          var taskId = task.id;
          tasksData.set('taskId', { 'taskId' : taskId });
          $scope.currentTaskId = taskId;

          var searchParams = $location.search() || {};
          searchParams.task = taskId;
          updateSilently(searchParams);
        };

        var selectNextTask = function() {
          for(var i = 0; i < $scope.tasks.length - 1; i++) {
            if($scope.tasks[i].id === $scope.currentTaskId) {
              return $scope.focus(null, $scope.tasks[i+1]);
            }
          }
          if($scope.pageNum < Math.ceil($scope.totalItems / $scope.pageSize)) {
            $scope.pageNum++;
            forceFocus = 'first';
            $scope.pageChange();
          }
        };

        var selectPreviousTask = function() {
          for(var i = 1; i < $scope.tasks.length; i++) {
            if($scope.tasks[i].id === $scope.currentTaskId) {
              return $scope.focus(null, $scope.tasks[i-1]);
            }
          }
          if($scope.pageNum > 1) {
            $scope.pageNum--;
            forceFocus = 'last';
            $scope.pageChange();
          }
        };

        $scope.handleKeydown = function($event) {
          if($event.keyCode === 40) {
            $event.preventDefault();
            selectNextTask($event);
          }
          else if($event.keyCode === 38) {
            $event.preventDefault();
            selectPreviousTask();
          }
          // wait for angular to update the classes and scroll to the newly selected task
          $timeout(function(){
            $($event.target).find('li.active')[0].scrollIntoView(false);
          });
        };

        /**
         * invoked when pagination is changed
         */
        $scope.pageChange = function() {
          // update query
          updateSilently({
            page:  $scope.pageNum
          });
          tasksData.changed('taskListQuery');
        };

         $scope.resetPage = function() {
           updateSilently({
             page: 1
           });
           tasksData.changed('taskListQuery');
         };

      }]
    };
  }];
});
