'use strict';

var fs = require('fs');

var template = fs.readFileSync(__dirname + '/tasks.html', 'utf8');

module.exports = [
  'ViewsProvider',
  function (
    ViewsProvider
  ) {
    ViewsProvider.registerDefaultView('cockpit.dashboard.section', {
      id: 'tasks',
      label: 'Tasks',
      template: template,
      pagePath: '#/tasks',
      checkActive: function (path) {
        return path.indexOf('#/tasks') > -1;
      },
      controller: [
        '$scope',
        'camAPI',
        function(
          $scope,
          camAPI
        ) {
          $scope.count = 0;
          $scope.loadingState = 'LOADING';

          var TaskResource = camAPI.resource('task');
          TaskResource.count({}, function (err, count) {
            if (err) {
              $scope.loadingError = err.message;
              $scope.loadingState = 'ERROR';
              throw err;
            }
            $scope.loadingState = 'LOADED';
            $scope.count = count || 0;
          });
        }],

      priority: 0
    });
  }];
