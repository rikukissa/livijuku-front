'use strict';

var tilat = require('utils/hakemuksenTilat');

module.exports = function () {
  return {
    scope: {
      tila: '@',
      tyyppi: '@'
    },
    template: require('./index.html'),
    restrict: 'E',
    controller: ['$scope', function($scope) {
      $scope.tilat = tilat.getAll($scope.tyyppi);

      $scope.isUpcoming = function(tila) {
        return $scope.tilat.indexOf(tilat.find($scope.tila)) < $scope.tilat.indexOf(tila);
      };
    }]
  };
};
