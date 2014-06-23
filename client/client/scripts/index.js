'use strict';
if (typeof define !== 'function') { var define = require('amdefine')(module); }
/* jshint unused: false */
define('camunda-tasklist-ui', [
           'camunda-tasklist-ui/rjsconf',
           'camunda-tasklist-ui/utils'
], function(rjsConf, utils) {
  var tasklistConf = typeof window !== 'undefined' ? (window.tasklistConf || {}) : {};

  /**
   * @namespace cam
   */

  /**
   * @module cam.tasklist
   */

  var tasklistApp;

  var appModules = rjsConf.shim['camunda-tasklist-ui'];

  var deps = [
    'angular',
    'text!camunda-tasklist-ui/index.html'
  ].concat(appModules);

  // converts AMD paths to angular module names
  // "camunda-tasklist-ui/pile" will be "cam.tasklist.pile"
  function rj2ngNames(names) {
    var name, translated = [];
    for (var n = 0; n < names.length; n++) {
      name = (require(names[n]) || {}).name;
      if (name) translated.push(name);
    }
    return translated;
  }


  function loaded() {
    var angular = require('angular');
    var $ = angular.element;

    var ngDeps = rj2ngNames(appModules).concat([
      'ngRoute'
    ]);

    tasklistApp = angular.module('cam.tasklist', ngDeps);


    tasklistApp.config([
            '$routeProvider', '$locationProvider',
    function($routeProvider,   $locationProvider) {
      var tasklistTemplate = require('text!camunda-tasklist-ui/index.html');

      $routeProvider
        .when('/', {
          template: tasklistTemplate,
          controller: [function() {}]
        })


        .when('/login', {
          template: tasklistTemplate,
          controller: 'userLoginCtrl'
        })


        .when('/logout', {
          template: tasklistTemplate,
          controller: 'userLogoutCtrl'
        })


        .otherwise({
          redirectTo: '/'
        });
    }]);

    $(document).ready(function() {
      angular.bootstrap(document, ['cam.tasklist']);
    });
  }


  // configure require.js
  require.config(rjsConf);

  // and load the dependencies
  require(deps, loaded);

  return {
    deps:       deps,
    appModules: appModules,
    loaded:     loaded,
    rj2ngNames: rj2ngNames,
    rjsConf:    rjsConf
  };
});
