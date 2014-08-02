/// <reference path="tsd.d.ts" />

angular.module('frontend', [ 'ui.router', 'app-controller', 'team-controller', 'frontend-main'
    , 'templates', 'teamService', 'sprintService', 'ui.bootstrap'])
  .config(function($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider): any {
    $urlRouterProvider
      .otherwise('/');
  })
  .config(function($httpProvider: ng.IHttpProvider): void {
    
  });
