'use strict';
var angular = require('angular');

angular.module('jukufrontApp')
  .directive('hakemusLabel', function () {
    return {
      scope: {
        tila: '=hakemusLabelTila'
      },
      restrict: 'E',
      link: function (scope, element, attrs) {
        attrs.$observe('tila', function (tilatunnus) {
          var htmlText = '<span class="label label-default">Unknown</span>';
          switch (tilatunnus) {
            case 'K':
              htmlText = '<span class="label label-warning">Keskeneräinen</span>';
              break;
            case 'V':
              htmlText = '<span class="label label-danger">Vireillä</span>';
              break;
            case 'T':
              htmlText = '<span class="label label-success">Tarkastettu</span>';
              break;
            case 'T0':
              htmlText = '<span class="label label-info">Täydennettävänä</span>';
              break;
            case 'TV':
              htmlText = '<span class="label label-danger">Täydennetty</span>';
              break;
            case 'P':
              htmlText = '<span class="label label-success">Päätetty</span>';
              break;
            case 'M':
              htmlText = '<span class="label label-default">Maksettu</span>';
              break;
            case '0':
              htmlText = '<span class="label label-default">Ei käynnissä</span>';
              break;
            case 'FEK':
              htmlText = '<span class="label label-default">Ei käynnissä</span>';
              break;
          }
          element.replaceWith(htmlText);
        });
      }
    };
  }
);
