define([], function() {
  'use strict';
  return ['camAPI', 'Notifications', '$translate',
  function(camAPI,   Notifications,   $translate) {
    var Task = camAPI.resource('task');
    /**
     * Search for tasks which are assigned to the user and display a notification containin a list of these tasks
     *
     * @param {Object} params
     * @param {String} [params.assignee]              The name of the user for which the tasks should be retrieved
     * @param {String} [params.processInstanceId]     The ID of the process instance.
     * @param {String} [params.caseInstanceId]        The ID of the case instance.
     */
    return function(params) {
      Task.list(params, function(err, data) {
        if(data._embedded.task.length > 0) {
          var msg = "";
          for(var task, i = 0; !!(task = data._embedded.task[i]); i++) {
            msg += '<a ng-href="#/?task='+ task.id +'" ng-click="removeNotification(notification)">'+task.name+'</a>, ';
          }
          $translate('ASSIGN_NOTE').then(function(translated) {
            Notifications.addMessage({
              duration: 16000,
              status: translated,
              message: msg.slice(0,-2)
            });
          });
        }
      });
    };
  }];
});
