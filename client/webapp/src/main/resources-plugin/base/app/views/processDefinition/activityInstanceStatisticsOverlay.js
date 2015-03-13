/* global define: false */
define(['angular', 'text!./activity-instance-statistics-overlay.html'], function(angular, template) {
  'use strict';

  return [ 'ViewsProvider', function(ViewsProvider) {

    ViewsProvider.registerDefaultView('cockpit.processDefinition.diagram.overlay', {
      id: 'activity-instance-statistics-overlay',
      template: template,
      controller: [
               '$scope',
      function ($scope) {

        var bpmnElement = $scope.bpmnElement,
            processData = $scope.processData.newChild($scope);

        processData.provide('activityInstance', ['activityInstanceStatistics', function (activityInstanceStatistics) {
          for (var i = 0; i < activityInstanceStatistics.length; i++) {
            var current = activityInstanceStatistics[i];
            if (current.id === bpmnElement.id) {
              return current;
            }
          }
          return null;
        }]);

        $scope.activityInstance = processData.observe('activityInstance', function(activityInstance) {
          if (activityInstance) {
            bpmnElement.isSelectable = true;
          }

          $scope.activityInstance = activityInstance;
        });

        var currentFilter = processData.observe('filter', function(filter) {
          currentFilter = filter;
        });

        $scope.selectRunningInstances = function(e) {
          var newFilter = angular.copy(currentFilter),
              ctrl = e.ctrlKey,
              activityId = bpmnElement.id,
              activityIds = angular.copy(newFilter.activityIds) || [],
              idx = activityIds.indexOf(activityId),
              selected = idx !== -1;

          if (!activityId) {
            activityIds = null;

          } else {

            if (ctrl) {
              if (selected) {
                activityIds.splice(idx, 1);

              } else {
                activityIds.push(activityId);
              }

            } else {
              activityIds = [ activityId ];
            }
          }

          newFilter.activityIds = activityIds;

          processData.set('filter', newFilter);
        };

      }],
      priority: 20
    });
  }];
});
