/// <reference path="tsd.d.ts" />

interface IMainScope extends ng.IScope {
  teams: ITeamResource[];
  selectTeam: ($event: ITeamResource) => void;
}

angular.module('frontend-main', ['ngRoute'])
  .config(function ($routeProvider: ng.route.IRouteProvider): void {
    $routeProvider
      .when('/', {
        templateUrl: 'main/main.html',
        controller: 'MainCtrl'
      });
  })
  .controller('MainCtrl', function ($scope: IMainScope, Team: ITeamResourceClass, Sprint: ISprintResourceClass): void {
    var teams: ITeamResource[] = Team.query();
    $scope.teams = teams;
    $scope.selectTeam = function ($event: ITeamResource): void {
      var selectedIdent: string = $event.teamIdent;
      Sprint.query({teamId: selectedIdent});
    };
  });
