/// <reference path="tsd.d.ts" />

import ngr = ng.resource;

interface ISprintResource extends ngr.IResource<ISprintResource> {
  sprintTeam: string;
  sprintIdent: string;
  sprintNumber: number;
  sprintPeople: number;
  sprintWorkDays: number;
  sprintVacationDays: number;
  sprintInterruptHours?: number;
  sprintPlannedPoints: number;
  sprintDeliveredPoints?: number;
  sprintLatest: boolean;
}

interface ISprintList {
  count: number;
  offset: number;
  items: ISprintResource[];
}

interface ISprintParams extends Object {
  teamId: string;
  id?: string;
}

interface ISprintResourceClass extends ngr.IResourceClass<ISprintResource> {
}

var sprintService: ng.IModule = angular.module('sprintService', ['ngResource']);

sprintService.factory('Sprint', ['$resource',
  function($resource: ngr.IResourceService): ngr.IResourceClass<ISprintResource> {
    var queryDescriptor: ngr.IActionDescriptor;
    var getDescriptor: ngr.IActionDescriptor;
    var saveDescriptor: ngr.IActionDescriptor;
    queryDescriptor = {
      method: 'GET',
      url: 'http://localhost:3000/1.0.0/team/:teamId/sprint',
      isArray: true,
      transformResponse: {
        function (data: string): ISprintResource[] {
          var parsed: ISprintList = angular.fromJson(data);
          return parsed.items;
        }
      }
    };
    getDescriptor = {
      method: 'GET',
      isArray: false
    };
    saveDescriptor = {
      method: 'POST',
      isArray: false
    };
    return $resource<ISprintResource, ISprintResourceClass>('http://localhost:3000/1.0.0/team/:teamId/sprint/id/:id'
        , {teamId: '@sprintTeam', id: '@sprintIdent'}, {
      query: queryDescriptor,
      get: getDescriptor,
      save: saveDescriptor
    });
  }]);
