let AbstractAPIHandler = require("AbstractAPIHandler");
const ENV_KEY = "yourKEYHere";
const ENY_SEC = "ba2a2bded3a84844baa71fe5a3e59e00";
const HEADER_STRING = JSON.stringify({
  appkey: ENV_KEY,
  appsecret: ENY_SEC
});
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let { materialId, org_id, cmmssnMerchant, merchant, productApplyRangeId } = request;
    return new fillMaterialInfoAPI().fill(materialId, org_id, cmmssnMerchant, merchant, productApplyRangeId);
  }
}
class fillMaterialInfoAPI {
  fill(materialId, org_id, cmmssnMerchant, merchant, productApplyRangeId) {
    let sql1 = `select basePrice from GT7239AT6.GT7239AT6.cmmssn_mar_basprc_b where product = '${materialId}' and  cmmssn_mar_basprc_bFk.org_id = 'youridHere' and cmmssn_mar_basprc_bFk.cmmssn_merchant = '${cmmssnMerchant}' `;
    let basePrice = ObjectStore.queryByYonQL(sql1);
    var date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var today = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
    let sql2 = `select price,isPriceContainsTax,productionDate from GT7239AT6.GT7239AT6.salesPriceList_b where product ='${materialId}' and salesPriceList_bFk.org_id = 'youridHere' and merchant = '${merchant}' and productionDate <= '${today}' order by productionDate desc limit 1`;
    let price = ObjectStore.queryByYonQL(sql2);
    debugger;
    var productRes = {},
      taxrateInfo = {};
    let productUrl = `https://api.diwork.com/yonbip/digitalModel/product/detail?id=${materialId}&productApplyRangeId=${productApplyRangeId}`;
    var productRes = ublinker("get", productUrl, HEADER_STRING, null);
    productRes = JSON.parse(productRes);
    if (productRes && productRes.data && productRes.data.id) {
      productRes = productRes.data;
      let taxrateUrl = `https://api.diwork.com/yonbip/digitalModel/taxrate/findById?id=${productRes.detail.outTaxrate}`;
      var taxrateJson = ublinker("get", taxrateUrl, HEADER_STRING, null);
      var taxrateRes = JSON.parse(taxrateJson);
      if (taxrateRes && taxrateRes.data && taxrateRes.data.id) {
        taxrateRes = taxrateRes.data;
      }
      let unitUrl = `https://api.diwork.com/yonbip/digitalModel/unit/detail?id=${productRes.unit}`;
      var unitJson = ublinker("get", unitUrl, HEADER_STRING, null);
      var unitRes = JSON.parse(unitJson);
      if (unitRes && unitRes.data && unitRes.data.id) {
        unitRes = unitRes.data;
      }
    }
    return { basePrice: basePrice, price: price, taxrateRes, taxrateRes, unitRes };
  }
}
exports({ entryPoint: MyAPIHandler });