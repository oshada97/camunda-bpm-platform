'use strict';

var DecisionDefinitionPage = require('./definition-view');
var TableDecisionInstancesPage = require('./tabs/decision-instances-tab');
var TablePage = require('./../dmn-table');
var VersionPage = require('./version');

module.exports = new DecisionDefinitionPage();
module.exports.table = new TablePage();
module.exports.version = new VersionPage();
module.exports.decisionInstancesTab = new TableDecisionInstancesPage();
