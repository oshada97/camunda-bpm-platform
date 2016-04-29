'use strict';

var angular = require('camunda-commons-ui/vendor/angular'),
    angularRoute = require('angular-route'),
    camundaCommonsUi = require('camunda-commons-ui'),
    authorizations = require('./authorizations'),
    authorizationCreate = require('./authorizationCreate'),
    authorizationDeleteConfirm = require('./authorizationDeleteConfirm'),
    users = require('./users'),
    dashboard = require('./dashboard'),
    userCreate = require('./userCreate'),
    userEdit = require('./userEdit'),
    groups = require('./groups'),
    groupCreate = require('./groupCreate'),
    groupEdit = require('./groupEdit'),
    groupMembershipsCreate = require('./groupMembershipsCreate'),
    setup = require('./setup'),
    system = require('./system'),
    systemSettingsGeneral = require('./systemSettingsGeneral'),
    executionMetrics = require('./execution-metrics');

  var ngModule = angular.module('cam.admin.pages', ['ngRoute', 'cam.commons']);

  ngModule.config(authorizations);
  ngModule.controller('AuthorizationCreateController', authorizationCreate);
  ngModule.controller('ConfirmDeleteAuthorizationController', authorizationDeleteConfirm);
  ngModule.config(dashboard);
  ngModule.config(users);
  ngModule.config(userCreate);
  ngModule.config(userEdit);
  ngModule.config(groups);
  ngModule.config(groupCreate);
  ngModule.config(groupEdit);
  ngModule.controller('GroupMembershipDialogController', groupMembershipsCreate);
  ngModule.config(setup);
  ngModule.config(system);
  ngModule.config(systemSettingsGeneral);
  ngModule.config(executionMetrics);

  module.exports = ngModule;
