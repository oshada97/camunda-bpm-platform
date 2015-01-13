'use strict';


define([
  'angular',
  'moment',

  './directives/cam-tasklist-task',
  './directives/cam-tasklist-task-meta',

  './controller/cam-tasklist-task-action-ctrl',
  './controller/cam-tasklist-task-groups-ctrl',

  /* detail plugins */
  './plugins/detail/cam-tasklist-task-detail-form-plugin',
  './plugins/detail/cam-tasklist-task-detail-history-plugin',
  './plugins/detail/cam-tasklist-task-detail-diagram-plugin',
  './plugins/detail/cam-tasklist-task-detail-description-plugin',

  /* detail plugin directives */
  './plugins/detail/directives/cam-tasklist-task-diagram',


  /* action plugins */
  './plugins/action/cam-tasklist-task-action-comment-plugin',

  /* action plugin controller */
  './plugins/action/modals/cam-tasklist-comment-form',

  /* modals */
  './modals/cam-tasklist-groups-modal',

  'camunda-tasklist-ui/api',
  'angular-bootstrap'

], function(
  angular,
  moment,

  taskDirective,
  taskMetaDirective,

  camTaskActionCtrl,
  camTaskGroupsCtrl,

  /* detail plugins */
  camTaskDetailFormPlugin,
  camTaskDetailHistoryPlugin,
  camTaskDetailDiagramPlugin,
  camTaskDetailDescriptionPlugin,

  /* detail plugin directives */
  taskDiagramDirective,

  /* action plugins */
  camTaskActionCommentPlugin,

  /* action plugin controller */
  camCommentCreateModalCtrl,

  /* modals */
  camGroupEditModalCtrl
) {

  var taskModule = angular.module('cam.tasklist.task', [
    require('camunda-tasklist-ui/api').name,
    'ui.bootstrap',
    'cam.tasklist.form',
    'angularMoment'
  ]);

  /**
   * @module cam.tasklist.task
   */

  /**
   * @memberof cam.tasklist
   */

  taskModule.directive('camTasklistTask', taskDirective);

  taskModule.directive('camTasklistTaskMeta', taskMetaDirective);

  taskModule.controller('camTaskActionCtrl', camTaskActionCtrl);
  taskModule.controller('camTaskGroupsCtrl', camTaskGroupsCtrl);

  /* detail plugins */
  taskModule.config(camTaskDetailFormPlugin);
  taskModule.config(camTaskDetailHistoryPlugin);
  taskModule.config(camTaskDetailDiagramPlugin);
  taskModule.config(camTaskDetailDescriptionPlugin);

  /* detail plugin directives */
  taskModule.directive('camTasklistTaskDiagram', taskDiagramDirective);

    /* action plugins */
  taskModule.config(camTaskActionCommentPlugin);

  /* action plugin controller */
  taskModule.controller('camCommentCreateModalCtrl', camCommentCreateModalCtrl);

  taskModule.controller('camGroupEditModalCtrl', camGroupEditModalCtrl);

  return taskModule;
});
