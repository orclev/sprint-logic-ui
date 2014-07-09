/// <reference path="tsd.d.ts" />

interface IAppScope extends ng.IScope {
  selectedTeam: ITeamResource;
  selectedTeamName: string;
  selectTeam: (team: ITeamResource) => void;
}

angular.module('app-controller', ['teamService'])
  .controller('AppCtrl', function ($scope: IAppScope, Team: ITeamResourceClass): void {
    $scope.selectedTeamName = "Select Team";
    $scope.selectedTeam = undefined;
    if (window.localStorage.getItem('selectedTeamId') != null) {
      Team.get({ id: window.localStorage.getItem('selectedTeamId') }, function(team: ITeamResource): void {
        $scope.selectTeam(team);
      });
    }
    $scope.selectTeam = function (team: ITeamResource): void {
      $scope.selectedTeam = team;
      $scope.selectedTeamName = "Team: " + team.teamName;
      window.localStorage.setItem('selectedTeamId', team.teamIdent);
    };
  });
