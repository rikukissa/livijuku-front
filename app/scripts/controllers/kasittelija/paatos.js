'use strict';

var _ = require('lodash');
var angular = require('angular');
var $ = require('jquery');
var pdf = require('utils/pdfurl');

angular.module('jukufrontApp')
  .controller('KasittelijaPaatosCtrl', ['$rootScope', '$scope', '$routeParams', '$location', 'HakemusService', 'StatusService', 'PaatosService', 'SuunnitteluService', '$window', function ($rootScope, $scope, $routeParams, $location, HakemusService, StatusService, PaatosService, SuunnitteluService, $window) {

    function haePaatosTiedot() {
      HakemusService.hae($scope.hakemusid)
        .success(function (data) {
          $scope.avustushakemus = data;
          $scope.hakija = _.find($rootScope.organisaatiot, {'id': $scope.avustushakemus.organisaatioid}).nimi;
        })
        .error(function (data) {
          StatusService.virhe('HakemusService.hae(' + $routeParams.id + ')', data.message);
        });

      PaatosService.hae($scope.hakemusid)
        .success(function (data) {
          if (data == null) {
            $scope.paatos = {
              myonnettyavustus: 0,
              paattajanimi: "",
              selite: ""
            };
          } else {
            $scope.paatos = data;
          }
        })
        .error(function (data) {
          StatusService.virhe('PaatosService.hae(' + $scope.hakemusid + ')', data.message);
        });
    }

    $scope.hakemusid = parseInt($routeParams.hakemusid);
    $scope.haettuavustus = $routeParams.haettuavustus;
    $scope.avustus = $routeParams.avustus;
    $scope.vuosi = $routeParams.vuosi;
    $scope.tyyppi = $routeParams.tyyppi;
    $scope.lajitunnus = $routeParams.lajitunnus;
    $scope.aikaleima = new Date();
    $scope.vanhaArvo = 0;

    $scope.asetaVanhaArvo = function (arvo) {
      $scope.vanhaArvo = arvo;
    };

    $scope.getPaatosPdf = function () {
      return pdf.getPaatosPdfUrl($scope.hakemusid);
    };

    $scope.haeHakemusPdf = function () {
      return pdf.getHakemusPdfUrl($scope.hakemusid);
    };

    $scope.hakemusTarkastettu = function () {
      if (typeof $scope.avustushakemus === 'undefined') return false;
      return $scope.avustushakemus.hakemustilatunnus == 'T';
    };

    $scope.naytaPaatos = function () {
      if ($scope.hakemusTarkastettu()) {
        $scope.tallennaPaatos(1);
      } else {
        $window.open(pdf.getPaatosPdfUrl($scope.hakemusid));
      }
    };

    /* Toiminnallisuus poistettu toistaiseksi, koska ASHA ei tue peruuttamista, JEG/15.5.2015
     $scope.peruPaatos = function () {
     PaatosService.peru($scope.hakemusid)
     .success(function () {
     StatusService.ok('PaatosService.peru(' + $scope.hakemusid + ')', 'Hakemuksen päätös peruttiin.');
     $location.path('/k/suunnittelu/' + $scope.vuosi + '/' + $scope.tyyppi + '/' + $scope.lajitunnus);
     })
     .error(function (data) {
     StatusService.virhe('PaatosService.peru(' + $scope.hakemusid + ')', data);
     });
     };
     */

    $scope.tallennaPaatos = function (lisatoiminto) {
      StatusService.tyhjenna();
      if ($scope.paatosForm.$valid) {
        if ($rootScope.sallittu('hyvaksy-paatos')) {
          $scope.paatos.paattajanimi = $rootScope.user.etunimi + ' ' + $rootScope.user.sukunimi;
        } else {
          $scope.paatos.paattajanimi = '';
        }
        if (lisatoiminto === 1) var ikkuna = $window.open('about:blank', '_blank');
        var paatosdata = {
          "hakemusid": parseInt($scope.hakemusid),
          "myonnettyavustus": parseFloat($scope.avustus),
          "paattajanimi": $scope.paatos.paattajanimi,
          "selite": $scope.paatos.selite
        };
        PaatosService.tallenna($scope.hakemusid, paatosdata)
          .success(function () {
            StatusService.ok('PaatosService.tallenna()', 'Tallennus onnistui.');
            $scope.paatosForm.$setPristine();
            haePaatosTiedot();
            switch (lisatoiminto) {
              case 0:
                // Pelkka tallennus
                break;
              case 1:
                // Esikatselu
                ikkuna.location.href = pdf.getPaatosPdfUrl($scope.hakemusid);
                break;
              case 2:
                // Hyvaksy
                PaatosService.hyvaksy($scope.hakemusid)
                  .success(function () {
                    StatusService.ok('PaatosService.hyvaksy(' + $scope.hakemusid + ')', 'Hakemus päivitettiin päätetyksi.');
                    SuunnitteluService.suunniteltuAvustus(parseFloat($scope.avustus), $scope.hakemusid)
                      .success(function () {
                      })
                      .error(function (data) {
                        StatusService.virhe('SuunnitteluService.suunniteltuAvustus(' + $scope.avustus + ',' + $scope.hakemusid + ')', data);
                      });
                    $location.path('/k/suunnittelu/' + $scope.vuosi + '/' + $scope.tyyppi + '/' + $scope.lajitunnus);
                  })
                  .error(function (data) {
                    StatusService.virhe('PaatosService.hyvaksy(' + $scope.hakemusid + ')', data.message);
                  });
                break;
            }
          })
          .error(function (data) {
            StatusService.virhe('PaatosService.tallenna(' + paatosdata + ')', data.message);
          });
      }
      else {
        StatusService.virhe('PaatosService.tallenna()', 'Korjaa lomakkeen virheet ennen tallentamista.');
      }
    };

    $scope.tarkistaTyhja = function (arvo) {
      if (isNaN(arvo)) {
        $scope.paatos.myonnettyavustus = $scope.vanhaArvo;
      }
    };

    haePaatosTiedot()
  }]);
