/* global define: false */
'use strict';

define('snap-win', ['snap-svg'], function(snap) {
  window.Snap = snap;
});

define('camunda-tasklist-ui', [
  'camunda-tasklist-ui/require-conf',
  'camunda-tasklist-ui/utils',
  'snap-win'
], function(
  rjsConf
) {
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
  // "camunda-tasklist-ui/filter" will be "cam.tasklist.filter"
  function rj2ngNames(names) {
    var name, translated = [];
    for (var n = 0; n < names.length; n++) {
      if(names[n].indexOf("!") !== -1) continue;
      name = (require(names[n]) || {}).name;
      if (name) translated.push(name);
    }
    return translated;
  }



  function loaded() {
    var angular = require('angular');
    var $ = angular.element;

    // The sales guys at MS pretend it's not needed anymore
    // they probably never wrote a line of CSS... :(
    // http://jsfiddle.net/evildonald/jLuF5/
    function detectIE() {
      var s = document.body.style;
      var version;

      if (s.msTextCombineHorizontal !== undefined) {
        version = 11;
      }
      else if (s.msFlexOrder !== undefined) {
        version = 10;
      }
      else if (s.msTransform !== undefined) {
        version = 9;
      }

      if (version) {
        $('html').addClass('ie ie'+version);
      }
    }

    var ngDeps = rj2ngNames(appModules).concat([
      'pascalprecht.translate',
      'ngRoute',
      'dataDepend'
    ]);

    tasklistApp = angular.module('cam.tasklist', ngDeps);

    var notificationsPanel = require('camunda-commons-ui/directives/notificationsPanel');
    tasklistApp.directive('notificationsPanel', notificationsPanel);

    var engineSelect = require('camunda-commons-ui/directives/engineSelect');
    tasklistApp.directive('engineSelect', engineSelect);

    var autoFill = require('camunda-commons-ui/directives/autoFill');
    tasklistApp.directive('autoFill', autoFill);

    var nl2br = require('camunda-commons-ui/directives/nl2br');
    tasklistApp.directive('nl2br', nl2br);

    var compileTemplate = require('camunda-commons-ui/directives/compileTemplate');
    tasklistApp.directive('compileTemplate', compileTemplate);

    tasklistApp.config(require('camunda-tasklist-ui/config/uris'));
    tasklistApp.config(require('camunda-tasklist-ui/config/translations'));
    tasklistApp.config(require('camunda-tasklist-ui/config/routes'));
    tasklistApp.config(require('camunda-tasklist-ui/config/date'));
    tasklistApp.config(require('camunda-tasklist-ui/config/tooltip'));

    tasklistApp.controller('camTasklistAppCtrl', require('camunda-tasklist-ui/controller/cam-tasklist-app-ctrl'));
    tasklistApp.controller('camTasklistViewCtrl', require('camunda-tasklist-ui/controller/cam-tasklist-view-ctrl'));

    $(document).ready(function() {
      angular.bootstrap(document, ['cam.tasklist', 'cam.embedded.forms']);

      setTimeout(function() {
        var $aufocused = $('[autofocus]');
        if ($aufocused.length) {
          $aufocused[0].focus();
        }
      }, 300);

      detectIE();
    });
  }


  // configure require.js
  require.config(rjsConf);

  // and load the dependencies
  require(deps, loaded);
});
