'use strict';

var UsersPage = require('./users-dashboard');
var EditUserProfilePage = require('./edit-profile');
var EditUserAccountPage = require('./edit-account');
var EditUserGroupsPage = require('./edit-groups');
var EditUserGroupsModalPage = require('./edit-groups-modal');
var NewUserPage = require('./new');
var AdminUserSetupPage = require('./admin-setup');
var AuthenticationPage = require('../../../commons/pages/authentication');

module.exports = new UsersPage();
module.exports.editUserProfile = new EditUserProfilePage();
module.exports.editUserAccount = new EditUserAccountPage();
module.exports.editUserGroups = new EditUserGroupsPage();
module.exports.editUserGroups.selectGroupModal = new EditUserGroupsModalPage();
module.exports.newUser = new NewUserPage();
module.exports.adminUserSetup = new AdminUserSetupPage();
module.exports.authentication = new AuthenticationPage();
