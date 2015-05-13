'use strict';
angular.module('jukufrontApp')
  .directive('jkuAvustuskohde', function () {
    return {
      restrict: 'E',
      scope: {
        name: "@",
        hakemus: "=",
        kohde: "=",
        vuosi: "=",
        vertailuarvot: "&",
        hakemustyyppi: "="
      },
      controller: ["$scope", "$rootScope", "AvustuskohdeService", "AuthService", function ($scope, $rootScope, AvustuskohdeService, AuthService) {

        $scope.avustusprosentti = AvustuskohdeService.avustusprosentti($scope.vuosi, $scope.kohde.avustuskohdeluokkatunnus, $scope.kohde.avustuskohdelajitunnus);

        $scope.euroSyoteNumeroksi = function (arvo) {
          return parseFloat(arvo.replace(/[^0-9,-]/g, '').replace(',', '.'));
        };

        $scope.getName = function (key) {
          return $scope.kohde.avustuskohdeluokkatunnus + "-" + $scope.kohde.avustuskohdelajitunnus + "-" + key;
        };

        $scope.haeTooltip = function (syotekentta) {
          var tooltip = '';
          if ($scope.hakemustyyppi != 'AH0') {
            if (syotekentta == 'haettavaavustus') {
              tooltip = 'Avustushakemus:' + $scope.vertailuarvot().avustushakemusHaettavaAvustus.toString().replace('.', ',') + ' €';
            }
            else if (syotekentta == 'omarahoitus') {
              tooltip = 'Avustushakemus:' + $scope.vertailuarvot().avustushakemusOmaRahoitus.toString().replace('.', ',') + ' €';
            }
          }
          if ($scope.hakemustyyppi == 'MH2') {
            if (syotekentta == 'haettavaavustus') {
              tooltip = tooltip + '<br/>' + '1. Maksatushakemus:' + $scope.vertailuarvot().maksatushakemusHaettavaAvustus.toString().replace('.', ',') + ' €';
            }
            else if (syotekentta == 'omarahoitus') {
              tooltip = tooltip + '<br/>' + '1. Maksatushakemus:' + $scope.vertailuarvot().maksatushakemusOmaRahoitus.toString().replace('.', ',') + ' €';
            }
          }
          return tooltip;
        };

        $scope.isReadonly = function () {
          // TODO: LIVIJUKU-229 Toisten hakijoiden hakemusten syötekentät pitää muuttaa vain luku -tilaan
          // TODO: Poista muokkaus vireillä olevalta, jne. hakemuslomakkeelta.
          if (typeof $scope.hakemus === 'undefined') {
            return false;
          }
          else return !AuthService.hakijaSaaMuokataHakemusta($scope.hakemus);
        };

        $scope.omarahoitusRiittava = function (omarahoitus, haettavarahoitus) {
          var omarahoitus2, haettavarahoitus2;
          if ((typeof omarahoitus === 'undefined') || (typeof haettavarahoitus === 'undefined')) return true;
          if (typeof omarahoitus === 'string') {
            omarahoitus2 = $scope.euroSyoteNumeroksi(omarahoitus);
          }
          if (typeof haettavarahoitus === 'string') {
            haettavarahoitus2 = $scope.euroSyoteNumeroksi(haettavarahoitus);
          }
          if (typeof omarahoitus === 'number') {
            omarahoitus2 = parseFloat(omarahoitus);
          }
          if (typeof haettavarahoitus === 'number') {
            haettavarahoitus2 = parseFloat(haettavarahoitus);
          }
          return (((100 - $scope.avustusprosentti) / 100) * (haettavarahoitus2 + omarahoitus2)) <= omarahoitus2;
        };

        $scope.sallittuArvo = function (value) {
          if (typeof value === 'undefined') return false;
          var floatarvo;
          if (typeof value === 'string') {
            floatarvo = $scope.euroSyoteNumeroksi(value);
            return (floatarvo >= 0 && floatarvo <= 999999999.00);
          }
          return true;
        };

      }],
      templateUrl: 'views/yhteinen/jkuAvustuskohde.html'
    };
  });