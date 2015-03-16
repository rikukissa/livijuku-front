'use strict';
describe('Hakija tekee hakemuksen ja allekirjoittaja laittaa sen vireille', function () {

  //************************************************************************************
  // HUOM! Selkeyden vuoksi, pidetään niin, että xpath-merkkijonot kirjoitetaan
  // yksinkertaisiin hipsuihin ja niiden sisällä olevat merkkijonot ovat tuplahipsuissa
  //************************************************************************************

  var path = require('path');

  var db_http_service = process.env.DB_HTTP_SERVICE || "http://juku:juku@localhost:50000";
  var debug = process.env.DEBUG || 0;

  // Protractor oletus timeout on 10000, joten tämän kannattaa olla pienempi
  var DEFAULT_TIMEOUT=9000;

  function hasClass(classname) {
    // http://stackoverflow.com/questions/8808921/selecting-a-css-class-with-xpath
    return 'contains(concat(" ", normalize-space(@class), " "), " ' + classname + ' ")';
  }
  function containsText(text) {
    return 'contains(normalize-space(text()),"' + text + '")';
  }

  function makeGet(url) {
    return require('http').get(url);
  }

  function unhideFileInputs() {
    browser.executeScript(function () {
      $('input[type="file"]').removeClass('hidden-file-input');
    });
  }

  function createRestorePoint(restorePointName) {
    browser.wait(function () {
      return makeGet(db_http_service + '/juku/testing.create_restorepoint?restorepoint=' + restorePointName);
    }, DEFAULT_TIMEOUT);
  }

  function revertTo(restorePointName) {
    browser.wait(function () {
      return makeGet(db_http_service + '/juku/testing.revert_to?restorepoint=' + restorePointName);
    }, DEFAULT_TIMEOUT);
  }

  beforeAll(function() {
    createRestorePoint("beforeAll_hakijanhakemus");
  });

  afterAll(function () {
    revertTo("beforeAll_hakijanhakemus");
    // Jos DEBUG on päällä, Lokitetaan selaimen konsolituloste.
    if (debug) {
      browser.manage().logs().get('browser').then(function (browserLog) {
        console.log('browser console log: ' + require('util').inspect(browserLog));
      });
    }
  });

  function waitForInfoBox(partialText) {
    var infoBox = element(by.xpath('//div[@class="toast-message" and ' + containsText(partialText) + ']'));

    browser.wait(function () {
      return browser.isElementPresent(infoBox);
    }, DEFAULT_TIMEOUT);

    return infoBox;
  }

  it('LIVIJUKU-125 Test: Hakija täydentää tiedot avustushakemuslomakkeelle.' +
  ' -> Avustusakemuksen tallennus onnistuu.', function () {
    browser.get("/harri.html");
    element(by.partialLinkText("Omat hakemukset")).click();


    // Avataan Avustushakemuslomake
    //var avustushakemusAlaosa = '//*[' + containsText("Avustushakemus") + ']/../../div[' + hasClass("clickable") + ']';
    var avustushakemusAlaosa = '//*[contains(@data-ng-click, "valitseHakemus(hakemuskausi.vuosi,\'AH0")]';

    element(by.xpath(avustushakemusAlaosa)).click();

    // Varmistetaan, että PSA:n... lukee sivulla
    var psaTitle = "//*[" + hasClass('panel-title') + " and "
      + containsText('PSA:n mukaisen liikenteen hankinta') + "]";
    expect(element(by.xpath(psaTitle))).toBeDefined();

    // Syötetään avustuksia
    //element(by.xpath('//form/div[.=]/div[2]/div[1]/div[2]/div/input'))
  });
});

