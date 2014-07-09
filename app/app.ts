/// <reference path="tsd.d.ts" />

angular.module('frontend', [ 'ngRoute', 'app-controller', 'team-controller', 'frontend-main'
    , 'templates', 'mgcrea.ngStrap', 'teamService', 'sprintService'])
  .config(function($routeProvider: ng.route.IRouteProvider): any {
    return $routeProvider
      .otherwise({redirectTo: '/'});
  })
  .config(function($httpProvider: ng.IHttpProvider): void {
    //$httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  });
