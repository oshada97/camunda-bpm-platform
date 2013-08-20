'use strict';

define(['angular'], function(angular) {

  var module = angular.module('admin.pages');

  var Controller = ['$scope', 'UserResource', 'Notifications', '$location', function ($scope, UserResource, Notifications, $location) {

    // data model for user profile
    $scope.profile = {
      id : "",
      firstName : "",
      lastName : "",
      email : ""
    }

    // data model for credentials
    $scope.credentials = {
        password : "",
        password2 : ""
    };

    $scope.createUser = function() {
      var user = {
        profile : $scope.profile,
        credentials : { password : $scope.credentials.password }
      }
      
      UserResource.createUser(user).$then(function() {
        Notifications.addMessage({ type: "success", status: "Success", message: "Created new user "+user.profile.id});
        $location.path("/users");
      },
      function() {
        Notifications.addError({ status: "Failed", message: "Failed to create user. Check if it already exists." });
      });
    }

  }];

  var RouteConfig = [ '$routeProvider', function($routeProvider) {
    $routeProvider.when('/user-create', {
      templateUrl: 'pages/userCreate.html',
      controller: Controller
    });

    // multi tenacy
    $routeProvider.when('/:engine/user-create', {
      templateUrl: 'pages/userCreate.html',
      controller: Controller
    });
  }];

  module
    .config(RouteConfig);

});
