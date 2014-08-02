/// <reference path="tsd.d.ts" />

interface ITeamDialog {
  title: string;
  teams: ITeamResource[];
  selectTeam: (team: ITeamResource) => void;
}

interface ITeamScope extends IAppScope {
  teamDialog: ITeamDialog;
  teamSelectModal: any;
}

angular.module('team-controller', ['ngRoute', 'teamService', 'app-controller', 'ui.bootstrap'])
  .controller('TeamCtrl', function ($scope: ITeamScope, Team: ITeamResourceClass): void {
    $scope.teamDialog = {
      "title": "Teams",
      "teams": Team.query(),
      "selectTeam": function(team: ITeamResource): void {
        $scope.selectTeam(team);
        $scope.teamSelectModal.hide();
      }
    };
    $scope.$on("modal.show", function (event: ng.IAngularEvent, modal: any): void {
      $scope.teamSelectModal = modal;
    });
  });
