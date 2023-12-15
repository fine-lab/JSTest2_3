let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let data = request.data;
    if ("1" === data.billstatus) {
      let errresp = { code: "-1", message: "该单据已生成凭证，不能重复生成！" };
      return { resp: JSON.stringify(errresp) };
    }
    let appkey = "yourkeyHere";
    let appsecrect = "ecdc71125bf5432c808d9214d9c5ffd0";
    let tokenFun = extrequire("GT20457AT2.common.getToken");
    let tokenRes = tokenFun.execute({ appkey: appkey, appsecrect: appsecrect }, null);
    let access_token = tokenRes.access_token;
    let businessid = data.id;
    var detailsql =
      "select org,project,description,debit_subjects,debit_subjects2,credit_subjects,customer,bankaccbas,banktype,debit_amount,debit_charge,credit_amount from GT20457AT2.GT20457AT2.subdistribdetail where subdistribdetailFk ='" +
      businessid +
      "'";
    var detail = ObjectStore.queryByYonQL(detailsql);
    let exchangeRateFun = extrequire("GT20457AT2.common.getExchangeRateType");
    let exchangeRateRes = exchangeRateFun.execute({ access_token: access_token, rateCode: "01" }, null);
    let ratetype = exchangeRateRes.ratetype;
    let currencyFun = extrequire("GT20457AT2.common.getCurrency");
    let currencyResp = currencyFun.execute({ access_token: access_token }, null);
    let currency = currencyResp.currency;
    let vouchertypeFun = extrequire("GT20457AT2.common.getVoucherType");
    let vouchertypeResp = vouchertypeFun.execute({ access_token: access_token, typecode: "1" }, null);
    let vouchertype = vouchertypeResp.vouchertype;
    let accbookFun = extrequire("GT20457AT2.common.getAccBook");
    let accbookResp = accbookFun.execute({ access_token: access_token, orgName: detail[0].org }, null);
    let accbook = accbookResp.accbook;
    let orgFun = extrequire("GT20457AT2.common.getOrgByNameOrCode");
    let orgResp = orgFun.execute({ access_token: access_token, orgName: detail[0].org }, null);
    let pk_org = orgResp.pk_org;
    let customerFun = extrequire("GT20457AT2.common.getCustomer");
    let totaldebit_org = 0;
    let totalcredit_org = 0;
    let subFun = extrequire("GT20457AT2.common.getSubjects");
    let projectFun = extrequire("GT20457AT2.common.getProject");
    let bankaccFun = extrequire("GT20457AT2.common.getbankaccbas");
    for (let detailvo of detail) {
      let debit_vr1;
      let debit_vr2;
      let credit_vr1;
      let credit_vr2;
      let bankaccResp = bankaccFun.execute({ access_token: access_token, bankaccbasCode: detailvo.bankaccbas }, null);
      let bankacc = bankaccResp.bankaccbas;
      if (-1 !== bankacc) {
        debit_vr1 = bankacc.id;
        debit_vr2 = bankacc.bank;
      }
      let creditprojectResp = projectFun.execute({ access_token: access_token, projectCode: detailvo.project }, null);
      let creditprojects = creditprojectResp.project;
      if (creditprojects.length === 1) {
        credit_vr1 = creditprojects[0].id;
      } else {
        for (let credit of creditprojects) {
          if (credit.code === detailvo.project) {
            credit_vr1 = credit.id;
            break;
          }
        }
      }
      //客户
      let creditcustResp = customerFun.execute({ access_token: access_token, org: pk_org, custCode: detailvo.customer }, null);
      credit_vr2 = creditcustResp.cust;
      //获取科目
      let debitsubResp = subFun.execute({ access_token: access_token, subjectCode: detailvo.debit_subjects }, null);
      detailvo.debit_subjects = debitsubResp.subjectsid;
      let debitsub2Resp = subFun.execute({ access_token: access_token, subjectCode: detailvo.debit_subjects2 }, null);
      detailvo.debit_subjects2 = debitsub2Resp.subjectsid;
      let crebitsubResp = subFun.execute({ access_token: access_token, subjectCode: detailvo.credit_subjects }, null);
      detailvo.credit_subjects = crebitsubResp.subjectsid;
      //借方、贷方总金额计算
      if ("" === detailvo.debit_amount || undefined === detailvo.debit_amount) {
        detailvo.debit_amount = 0;
      }
      if ("" === detailvo.debit_charge || undefined === detailvo.debit_charge) {
        detailvo.debit_charge = 0;
      }
      if ("" === detailvo.credit_amount || undefined === detailvo.credit_amount) {
        detailvo.credit_amount = 0;
      }
      totaldebit_org = new Big(totaldebit_org).plus(detailvo.debit_amount).plus(detailvo.debit_charge);
      totalcredit_org = new Big(totalcredit_org).plus(detailvo.credit_amount);
      detailvo.debit_vr1 = debit_vr1;
      detailvo.debit_vr2 = debit_vr2;
      detailvo.credit_vr1 = credit_vr1;
      detailvo.credit_vr2 = credit_vr2;
    }
    var appContext = AppContext();
    let creator = JSON.parse(appContext).currentUser.id;
    let srcsystemid = "youridHere";
    let debit_field_vr1 = "vr8";
    let debit_field_vr2 = "vr9";
    let credit_field_vr1 = "vr2";
    let credit_field_vr2 = "vr5";
    let bsdata = {
      ratetype,
      currency,
      vouchertype,
      accbook,
      pk_org,
      totaldebit_org,
      totalcredit_org,
      srcsystemid,
      businessid,
      creator,
      debit_field_vr1,
      debit_field_vr2,
      credit_field_vr1,
      credit_field_vr2
    };
    let voucherSaveFun = extrequire("GT20457AT2.common.postVoucherSave");
    let voucherSaveResp = voucherSaveFun.execute({ access_token: access_token, bsdata: bsdata, detail: detail, billtypes: 1 }, null);
    let resp = voucherSaveResp.voucherResp;
    let result = JSON.parse(resp);
    if ("200" === result.code) {
      var object = { id: businessid, billstatus: "1", subTable: [{ hasDefaultInit: true, key: "yourkeyHere", _status: "Update" }] };
      var res = ObjectStore.updateById("GT20457AT2.GT20457AT2.subdistrib", object, "subdistrib");
    }
    return {
      resp,
      voucherSaveResp
    };
  }
}
exports({ entryPoint: MyAPIHandler });