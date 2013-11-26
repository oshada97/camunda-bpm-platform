ngDefine('cockpit.plugin.jobDefinition.views', ['require'], function(module, require) {

  var JobDefinitionSuspensionStateController = [ '$scope', '$http', '$filter', 'Uri', 'Notifications', '$dialog', 'dialog', 'jobDefinition',
                                  function($scope, $http, $filter, Uri, Notifications, $dialog, dialog, jobDefinition) {

    var BEFORE_UPDATE = 'BEFORE_UPDATE',
        PERFORM_UPDATE = 'PERFORM_UDPATE',
        UPDATE_SUCCESS = 'SUCCESS',
        UPDATE_FAILED = 'FAIL';

    var dateFilter = $filter('date'),
        dateFormat = 'yyyy-MM-dd\'T\'HH:mm:ss';


    $scope.jobDefinition = jobDefinition;

    $scope.status = BEFORE_UPDATE;

    $scope.includeJobs = true;
    $scope.executeImmediately = true;
    $scope.executionDate = dateFilter(Date.now(), dateFormat);

    $scope.$on('$routeChangeStart', function () {
      dialog.close($scope.status);
    });

    $scope.updateSuspensionState = function () {
      $scope.status = PERFORM_UPDATE;

      var data = {};

      data.suspended = !jobDefinition.suspended;
      data.includeJobs = $scope.includeJobs;
      data.executionDate = !$scope.executeImmediately ? $scope.executionDate : null;

      $http.put(Uri.appUri('engine://engine/:engine/job-definition/' + jobDefinition.id + '/suspended/'), data).success(function (data) {
        $scope.status = UPDATE_SUCCESS;

        if ($scope.executeImmediately) {
          Notifications.addMessage({'status': 'Finished', 'message': 'Updated the suspension state of the job definition.', 'exclusive': true });  
        } else {
          Notifications.addMessage({'status': 'Finished', 'message': 'The update of the suspension state of the job definition has been scheduled.', 'exclusive': true });  
        }

      }).error(function (data) {
        $scope.status = UPDATE_FAILED;

        if ($scope.executeImmediately) {
          Notifications.addError({'status': 'Finished', 'message': 'Could not update the suspension state of the job definition: ' + data.message, 'exclusive': true });
        } else {
          Notifications.addMessage({'status': 'Finished', 'message': 'The update of the suspension state of the job definition could not be scheduled: ' + data.message, 'exclusive': true });  
        }
      });
    }

    $scope.isValid = function () {
      if (!$scope.executeImmediately) {
        return $scope.updateSuspensionStateForm.$valid;    
      }
      return true;
    };

    $scope.close = function (status) {
      dialog.close(status);
    };

  }];

  module.controller('JobDefinitionSuspensionStateController', JobDefinitionSuspensionStateController);
});
