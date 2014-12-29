'use strict';

angular.module('jukufrontApp')
  .controller('KasittelijaHakemusCtrl', ['$rootScope', '$scope', '$location', '$routeParams', 'AvustuskohdeService', 'HakemusService', function ($rootScope, $scope, $location, $routeParams, AvustuskohdeService, HakemusService) {

    function haeHaettavaavustus(avustuskohdelaji) {
      if (_.some($scope.aktiivisetavustuskohteet, {'avustuskohdelajitunnus': avustuskohdelaji})) {
        return parseInt((_.find($scope.aktiivisetavustuskohteet, {'avustuskohdelajitunnus': avustuskohdelaji})).haettavaavustus);
      }
      else {
        return 0;
      }
    }

    function haeOmarahoitus(avustuskohdelaji) {
      if (_.some($scope.aktiivisetavustuskohteet, {'avustuskohdelajitunnus': avustuskohdelaji})) {
        return parseInt((_.find($scope.aktiivisetavustuskohteet, {'avustuskohdelajitunnus': avustuskohdelaji})).omarahoitus);
      }
      else {
        return 0;
      }
    }

    HakemusService.hae($routeParams.id)
      .success(function (data) {
        $scope.avustushakemus = data;
        $scope.hakija = _.find($rootScope.organisaatiot, {'id': $scope.avustushakemus.organisaatioid}).nimi;
        $scope.aikaleima = new Date();
      })
      .error(function (data) {
        console.log('Virhe: HakemusService.hae(' + $routeParams.id + ') ' + data);
      });

    AvustuskohdeService.hae($routeParams.id)
      .success(function (data) {
        $scope.aktiivisetavustuskohteet = data;
        $scope.psa1haettavaavustus = haeHaettavaavustus('PSA-1');
        $scope.psa1omarahoitus = haeOmarahoitus('PSA-1');
        $scope.psa2haettavaavustus = haeHaettavaavustus('PSA-2');
        $scope.psa2omarahoitus = haeOmarahoitus('PSA-2');
        $scope.psamhaettavaavustus = haeHaettavaavustus('PSA-M');
        $scope.psamomarahoitus = haeOmarahoitus('PSA-M');
        $scope.hkslhaettavaavustus = haeHaettavaavustus('HK-SL');
        $scope.hkslomarahoitus = haeOmarahoitus('HK-SL');
        $scope.hkklhaettavaavustus = haeHaettavaavustus('HK-KL');
        $scope.hkklomarahoitus = haeOmarahoitus('HK-KL');
        $scope.hkslhaettavaavustus = haeHaettavaavustus('HK-SL');
        $scope.hkslomarahoitus = haeOmarahoitus('HK-SL');
        $scope.hkllhaettavaavustus = haeHaettavaavustus('HK-LL');
        $scope.hkllomarahoitus = haeOmarahoitus('HK-LL');
        $scope.hktlhaettavaavustus = haeHaettavaavustus('HK-TL');
        $scope.hktlomarahoitus = haeOmarahoitus('HK-TL');
        $scope.kimhaettavaavustus = haeHaettavaavustus('K-IM');
        $scope.kimomarahoitus = haeOmarahoitus('K-IM');
        $scope.kmpkhaettavaavustus = haeHaettavaavustus('K-MPK');
        $scope.kmpkomarahoitus = haeOmarahoitus('K-MPK');
        $scope.kmkhaettavaavustus = haeHaettavaavustus('K-MK');
        $scope.kmkomarahoitus = haeOmarahoitus('K-MK');
        $scope.krthaettavaavustus = haeHaettavaavustus('K-RT');
        $scope.krtomarahoitus = haeOmarahoitus('K-RT');
        $scope.kmhaettavaavustus = haeHaettavaavustus('K-M');
        $scope.kmomarahoitus = haeOmarahoitus('K-M');
      })
      .error(function (data) {
        console.log('Virhe: AvustuskohdeService.hae(' + $routeParams.id + ') ' + data);
      });

    $scope.tarkastaAvustushakemus = function () {
      HakemusService.tarkasta($scope.avustushakemus.id)
        .success(function () {
          $location.path('/k/hakemukset');
        })
        .error(function (data) {
          console.log('Virhe: HakemusService.tarkasta(' + $scope.avustushakemus.id + '): ' + data);
        });
    };
  }]
);
