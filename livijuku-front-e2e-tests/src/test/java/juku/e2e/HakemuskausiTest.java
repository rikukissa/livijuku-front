package juku.e2e;

import static com.paulhammant.ngwebdriver.WaitForAngularRequestsToFinish.waitForAngularRequestsToFinish;
import static java.lang.Thread.sleep;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.testng.AssertJUnit.assertTrue;

import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.testng.annotations.Test;

public class HakemuskausiTest extends TestBase {

  @Test
  public void hakuohje_kauden_avaus_ja_restorepoint_update() throws IOException,
    InterruptedException {

    postHakuohje(2016);

    login(User.KATRI);

    boolean kaynnistaNapinTilaEnnen =
      findElementByXPath("//button[%s]", containsText("Käynnistä hakemuskausi")).isEnabled();
    assertTrue("Käynnistä hakemuskausi == enabled", kaynnistaNapinTilaEnnen);

    // Aseta avustuskauden alkupäivä 1.1.
    asetaAvustuskaudenAlkupaiva0101();

    findElementByXPath("//button[%s]", containsText("Käynnistä hakemuskausi")).click();
    waitForAngularRequestsToFinish(driver());

    boolean kaynnistaNappiNakyy = true;
    for (int i = 0; i < 25; i++) {
      sleep(100);
      try {
        findElementByXPath("//button[%s]", containsText("Käynnistä hakemuskausi"));
      } catch (NoSuchElementException e) {
        kaynnistaNappiNakyy = false;
        break;
      }
    }
    assertThat("Käynnistä hakemuskausi jäi näkyviin vaikka kausi avattiin.", kaynnistaNappiNakyy);

    // Päivitetään testien restorepoint tähän, jotta kautta ei tarvitse avata muissa testeissä.
    createRestorePoint(TEST_RESTORE_POINT);
  }

  private void asetaAvustuskaudenAlkupaiva0101() {
    findElementByLinkText("Muokkaa hakuaikoja").click();
    String datepicker = ".panel-primary > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > p:nth-child(1)";

    WebElement avustushakemuskaudenAlkupv = findElementByCssSelector(
      datepicker + " > span:nth-child(3) > button:nth-child(1)");
    avustushakemuskaudenAlkupv.click();
    WebElement vuosikuukausiValitsin = findElementByCssSelector(
      datepicker
        + " > ul:nth-child(2) > li:nth-child(1) > div:nth-child(1) > table:nth-child(1) > thead:nth-child(1) > tr:nth-child(1) > th:nth-child(2) > button");
    vuosikuukausiValitsin.click();
    WebElement kuukausi01 = findElementByCssSelector(
      datepicker
        + " > ul:nth-child(2) > li:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(1) > button");
    kuukausi01.click();
    WebElement paiva01 = findElementByCssSelector(
      datepicker
        + " > ul:nth-child(2) > li:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(5) > button");
    paiva01.click();

    findElementByLinkText("Tallenna hakuajat").click();
    waitForAngularRequestsToFinish(driver());
  }

  @Test
  public void hakijaaInformoidaanHakemuksenTilasta() {
    login(User.HARRI);
    // Assertoi tila keskeneräinen
    WebElement we = findElementByXPath("//span[%s and %s]", containsText("Keskeneräinen"), hasClass("label-warning"));
    // Avaa hakemus
    we.click();

    // Lähetä hakemus
    WebElement olenLiittanyt = findElementByXPath("//input[@type='checkbox']");
    olenLiittanyt.click();
    findElementByXPath("//button[%s]", containsText("Tallenna ja lähetä hakemus")).click();

    WebElement oletkoVarmaKylla = findElementByXPath("//button[%s]", containsText("Kyllä"));
    oletkoVarmaKylla.click();

    // Assertoi tila vireillä (find failaa, jos ei löydä)
    findElementByXPath("//span[%s and %s]", containsText("Vireillä"), hasClass("label-danger"));

    // Kirjaa sisään käsittelijä
    login(User.KATRI);

    // Ota hakemus käsittelyyn
//    WebElement vireillaLaatikko =
//      findElementByXPath("//div[div[%s]]/following-sibling::div/span[%s and %s]",
//                           containsText("1/"),
//                           containsText("Vireillä"),
//                           hasClass("label-danger"));
//    vireillaLaatikko.click();
//
//    WebElement helsinginSeudunVireilla =
//      findElementByXPath("//tr[td[%s]]/following-sibling::td/span[%s and %s]",
//                         containsText("Helsingin seudun liikenne"),
//                         containsText("Vireillä"),
//                         hasClass("label-danger"));
//    helsinginSeudunVireilla.click();

    // Kirjaa sisään hakija
    // Assertoi tila käsittelyssö
    // Kirjaa sisään käsittelijä
    // Palauta hakemus täydennettäväksi
    // Kirjaa sisään hakija
    // Assertoi tila täydennettävänä
    // Täydennä hakemus
    // Kirjaa sisään käsittelijä
    // Tarkasta hakemus
    // Kirjaa sisään hakija
    // Assertoi tila tarkastettu
    // Kirjaa sisään käsittelijä
    // Päätä hakemus
    // Kijraa sisään hakija
    // Assertoi tila päätetty
  }

  private void postHakuohje(int vuosi) throws IOException {
    CloseableHttpClient httpclient = HttpClients.createDefault();

    HttpPost httpPost = new HttpPost(baseUrl() + "api/hakemuskausi/" + vuosi + "/hakuohje");
    httpPost.addHeader("oam-remote-user", User.KATRI.getLogin());
    httpPost.addHeader("oam-user-organization", User.KATRI.getOrganization());
    httpPost.addHeader("oam-groups", User.KATRI.getGroup());

    FileBody hakuohje = new FileBody(getPathToTestPdf().toFile());

    HttpEntity reqEntity = MultipartEntityBuilder.create()
      .addPart("hakuohje", hakuohje)
      .build();
    httpPost.setEntity(reqEntity);
    System.out.println("************************************");

    try (CloseableHttpResponse response = httpclient.execute(httpPost)) {
      System.out.println(httpPost);
      System.out.println(response.getStatusLine());
      HttpEntity entity = response.getEntity();
      // do something useful with the response body
      // and ensure it is fully consumed
      EntityUtils.consume(entity);
    } finally {
      System.out.println("************************************");
    }
  }

  private Path getPathToTestPdf() {
    try {
      return Paths.get(ClassLoader.getSystemResource("test.pdf").toURI());
    } catch (URISyntaxException e) {
      e.printStackTrace();
      return null;
    }
  }

}