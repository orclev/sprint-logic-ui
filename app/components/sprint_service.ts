/// <reference path="tsd.d.ts" />

import ngr = ng.resource;

interface ISprintResource extends ngr.IResource<ISprintResource> {
  teamName: string;
  teamIdent: string;
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
  //get(params: Object): ISprintResource;
  //query(params: Object): ISprintResource[];
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
          var parsed: ITeamList = angular.fromJson(data);
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
