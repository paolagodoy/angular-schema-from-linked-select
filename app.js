angular.module('selectExample', ['schemaForm', 'mgcrea.ngStrap'])
       .controller('FormController', function($scope, $http, $q) {
  var selectLinkedChange = function(key, model) {
    $scope[model.childItem].splice(0);

    var service = model.option.uri;

    if (model.option.params == "contexto") {
     service = service + "/" + key;
    }

    $http.get(service)
    .then(function(result) {
      result.data.forEach(function(item, index) {
        var map = model.option.map;
        if (model.option.params == "compare") {
          if (item[map.compareField] == key) {
            $scope[model.childItem].push({
              value: item[map.valueField],
              name: item[map.nameField]
            });
          }
        } else {
          $scope[model.childItem].push({
            value: item[map.valueField],
            name: item[map.nameField]
          });
        }
      });
    });
  };

  $scope.addLogic = function(form) {
    var formObject = {};

    if (typeof form == "string") {
      formObject = JSON.parse(form);
    } else {
      formObject = form;
    }

    formObject.forEach(function(item, index) {
      if (item.items) {
        $scope.addLogic(item.items);
      }
      if (item.tabs) {
        $scope.addLogic(item.tabs);
      }
      if (item.type == "select" || item.type == "strapselect") {
        if (item.selectLinked) {
          item.onChange = selectLinkedChange;
        }
        if (item.createTitleMap) {
          $scope[item.key] = [];
          item.titleMap = $scope[item.key];
        }
      }
    });

    return formObject;
  }

  $http.get('data/form-2.json').then(function(response) {
    $scope.schema = response.data.schema;
    $scope.form = $scope.addLogic(response.data.form);
  });

  $scope.model = {};
});
