/// <reference path="tsd.d.ts" />

//import ngr = ng.resource;

interface ITeamResource extends ngr.IResource<ITeamResource> {
  teamName: string;
  teamIdent: string;
}

interface ITeamList {
  count: number;
  offset: number;
  items: ITeamResource[];
}

interface ITeamResourceClass extends ngr.IResourceClass<ITeamResource> {
  get(): ITeamResource;
  query(): ITeamResource[];
  save(): ITeamResource;
}

var teamService: ng.IModule = angular.module('teamService', ['ngResource']);

teamService.factory('Team', ['$resource',
  function($resource: ngr.IResourceService): ngr.IResourceClass<ITeamResource> {
    var queryDescriptor: ngr.IActionDescriptor;
    var getDescriptor: ngr.IActionDescriptor;
    var saveDescriptor: ngr.IActionDescriptor;
    queryDescriptor = {
      method: 'GET',
      isArray: true,
      transformResponse: {
        function (data: string): ITeamResource[] {
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
    return $resource<ITeamResource, ITeamResourceClass>('http://localhost:3000/1.0.0/team/:id'
        , {id: '@teamIdent'}, {
      query: queryDescriptor,
      get: getDescriptor,
      save: saveDescriptor
    });
  }]);
