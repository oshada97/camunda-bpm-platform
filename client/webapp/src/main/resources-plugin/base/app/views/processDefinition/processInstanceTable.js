/* global define: false, angular: false */
define(['angular', 'text!./process-instance-table.html'], function(angular, template) {
  'use strict';

  return [ 'ViewsProvider', function(ViewsProvider) {

    ViewsProvider.registerDefaultView('cockpit.processDefinition.runtime.tab', {
      id: 'process-instances-table',
      label: 'Process Instances',
      template: template,
      controller: [
               '$scope', 'search', 'PluginProcessInstanceResource',
      function ($scope,   search,   PluginProcessInstanceResource) {

        var processData = $scope.processData.newChild($scope);

        var processDefinition = $scope.processDefinition;

        var DEFAULT_PAGES = { size: 50, total: 0, current: 1 };

        var pages = $scope.pages = angular.copy(DEFAULT_PAGES);

        var filter = null;

        $scope.$watch('pages.current', function(newValue, oldValue) {
          if (newValue == oldValue) {
            return;
          }

          search('page', !newValue || newValue == 1 ? null : newValue);
        });

        processData.observe('filter', function(newFilter) {
          pages.current = newFilter.page || 1;

          updateView(newFilter);
        });

        function updateView(newFilter) {

          filter = angular.copy(newFilter);

          delete filter.page;
          delete filter.scrollToBpmnElement;

          var page = pages.current,
              count = pages.size,
              firstResult = (page - 1) * count;

          var defaultParams = {
            processDefinitionId: processDefinition.id
          };

          var pagingParams = {
            firstResult: firstResult,
            maxResults: count,
            sortBy: 'startTime',
            sortOrder: 'desc'
          };

          var countParams = angular.extend({}, filter, defaultParams);

          // fix missmatch -> activityIds -> activityIdIn
          countParams.activityIdIn = countParams.activityIds;
          delete countParams.activityIds;

          // fix missmatch -> start -> startedAfter/startedBefore
          angular.forEach(countParams.start, function (dateFilter) {
            if (dateFilter.value) {
              if (dateFilter.type === 'after') {
                countParams.startedAfter = dateFilter.value;
              } else if (dateFilter.type === 'before') {
                countParams.startedBefore = dateFilter.value;
              }
            }
          });
          delete countParams.start;

          var params = angular.extend({}, countParams, pagingParams);

          $scope.processInstances = null;
          $scope.loadingState = 'LOADING';

          PluginProcessInstanceResource.query(pagingParams, params).$promise.then(function(data) {
            $scope.processInstances = data;
            $scope.loadingState = data.length ? 'LOADED' : 'EMPTY';
          });

          PluginProcessInstanceResource.count(countParams).$promise.then(function(data) {
            pages.total = data.count;
          });
        }
      }],
      priority: 10
    });
  }];
});
