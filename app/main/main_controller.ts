/// <reference path="tsd.d.ts" />

interface IMainScope extends IAppScope {
  sprints: ISprintResource[];
}

angular.module('frontend-main', ['ngRoute', 'sprintService'])
  .config(function ($routeProvider: ng.route.IRouteProvider): void {
    $routeProvider
      .when('/', {
        templateUrl: 'main/main.html',
        controller: 'MainCtrl'
      });
  })
  .controller('MainCtrl', function ($scope: IMainScope, Sprint: ISprintResourceClass): void {
    $scope.$watch('selectedTeam', function (newVal: ITeamResource, oldVal: ITeamResource): void {
        if(newVal === undefined) {
          $scope.sprints = [];
          return;
        }
        if(oldVal !== undefined && newVal.teamIdent === oldVal.teamIdent) {
          return;
        }
        $scope.sprints = Sprint.query({teamId: newVal.teamIdent});
      });
  });
